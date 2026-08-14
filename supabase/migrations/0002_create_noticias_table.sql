-- Fase 2 — tabela de notícias do site.
-- Reusa o projeto Supabase "ESC FACILITA" (nrlczntnxzyqumeteoem); nenhuma
-- instância nova. Leitura pública apenas de publicadas; escrita só para
-- administradores autenticados (Supabase Auth).

create table public.noticias (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  resumo text,
  conteudo text not null,
  capa_url text,
  publicada boolean not null default false,
  publicada_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Listagem do site: publicadas, mais recentes primeiro.
create index noticias_pub_idx on public.noticias (publicada, publicada_em desc);

alter table public.noticias enable row level security;

-- Visitante (anon): vê somente notícias publicadas.
create policy "public_read_noticias_publicadas"
  on public.noticias for select
  to anon
  using (publicada = true);

-- Admin autenticado: enxerga tudo, inclusive rascunhos.
create policy "auth_read_noticias"
  on public.noticias for select
  to authenticated
  using (true);

-- Admin autenticado: cria, edita e remove.
create policy "auth_insert_noticias"
  on public.noticias for insert
  to authenticated
  with check (true);

create policy "auth_update_noticias"
  on public.noticias for update
  to authenticated
  using (true)
  with check (true);

create policy "auth_delete_noticias"
  on public.noticias for delete
  to authenticated
  using (true);

-- updated_at automático a cada UPDATE.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger noticias_set_updated_at
  before update on public.noticias
  for each row execute function public.set_updated_at();
