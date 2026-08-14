-- M1 — Área do Cliente: perfis, clientes, contratos, parcelas + RLS.
-- Upload de documentos e solicitação de novo crédito ficam para o M3
-- (backoffice do operador) — ver issue #1 e ROADMAP.md.
--
-- Bootstrap do primeiro operador (não há auto-cadastro nem tela de convite
-- ainda — ver README, seção "Bootstrap do primeiro operador"):
--   1. Supabase Studio → Authentication → Add user (email + senha).
--   2. SQL Editor:
--        insert into public.perfis (id, role, nome)
--        values ('<uuid do usuário criado acima>', 'operador', 'Seu Nome');

-- ─── perfis ──────────────────────────────────────────────────────────────
-- 1 linha por usuário do Supabase Auth (cliente OU operador).
create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('cliente', 'operador')),
  nome text not null,
  created_at timestamptz not null default now()
);

alter table public.perfis enable row level security;

-- security definer: consultada de dentro das próprias policies de `perfis`
-- (RLS não pode reconsultar a tabela que está protegendo sem isso).
create function public.is_operador()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.perfis
    where id = auth.uid() and role = 'operador'
  );
$$;

create policy "perfis_select_propria_ou_operador"
  on public.perfis for select
  to authenticated
  using (id = auth.uid() or public.is_operador());

create policy "perfis_insert_operador"
  on public.perfis for insert
  to authenticated
  with check (public.is_operador());

create policy "perfis_update_operador"
  on public.perfis for update
  to authenticated
  using (public.is_operador());

-- ─── clientes ────────────────────────────────────────────────────────────
-- Dados de negócio do cliente — 1:1 com uma linha de `perfis` (role='cliente').
create table public.clientes (
  id uuid primary key references public.perfis (id) on delete cascade,
  cpf text not null unique,
  telefone text,
  created_at timestamptz not null default now()
);

alter table public.clientes enable row level security;

create policy "clientes_select_propria_ou_operador"
  on public.clientes for select
  to authenticated
  using (id = auth.uid() or public.is_operador());

create policy "clientes_insert_operador"
  on public.clientes for insert
  to authenticated
  with check (public.is_operador());

create policy "clientes_update_operador"
  on public.clientes for update
  to authenticated
  using (public.is_operador());

-- ─── contratos ───────────────────────────────────────────────────────────
create table public.contratos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes (id) on delete cascade,
  numero text not null,
  saldo_devedor numeric(12, 2) not null,
  taxa_juros numeric(6, 3),
  prazo_meses int,
  banco text,
  agencia text,
  conta_deposito text,
  status text not null default 'ativo' check (status in ('ativo', 'quitado', 'inadimplente')),
  created_at timestamptz not null default now()
);

alter table public.contratos enable row level security;

create policy "contratos_select_propria_ou_operador"
  on public.contratos for select
  to authenticated
  using (public.is_operador() or cliente_id = auth.uid());

create policy "contratos_insert_operador"
  on public.contratos for insert
  to authenticated
  with check (public.is_operador());

create policy "contratos_update_operador"
  on public.contratos for update
  to authenticated
  using (public.is_operador());

-- ─── parcelas ────────────────────────────────────────────────────────────
create table public.parcelas (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references public.contratos (id) on delete cascade,
  numero int not null,
  valor numeric(12, 2) not null,
  vencimento date not null,
  status text not null default 'aberto' check (status in ('paga', 'aberto', 'atraso')),
  pago_em timestamptz,
  created_at timestamptz not null default now()
);

alter table public.parcelas enable row level security;

create policy "parcelas_select_propria_ou_operador"
  on public.parcelas for select
  to authenticated
  using (
    public.is_operador()
    or contrato_id in (select id from public.contratos where cliente_id = auth.uid())
  );

create policy "parcelas_insert_operador"
  on public.parcelas for insert
  to authenticated
  with check (public.is_operador());

create policy "parcelas_update_operador"
  on public.parcelas for update
  to authenticated
  using (public.is_operador());
