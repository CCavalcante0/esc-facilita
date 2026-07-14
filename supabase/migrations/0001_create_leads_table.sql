-- Fase 1 — tabela de leads do formulário de pré-solicitação.
-- Aplicada no projeto Supabase "ESC FACILITA" (nrlczntnxzyqumeteoem) em 2026-07-13.

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  valor numeric,
  finalidade text,
  origem text check (origem in ('credito','diagnostico')),
  created_at timestamptz default now()
);

alter table public.leads enable row level security;

-- Insert publico: formulario de pre-solicitacao do site.
-- Nenhuma policy de select/update/delete: leitura apenas via service_role.
create policy "public_insert_leads"
  on public.leads for insert
  to anon
  with check (true);
