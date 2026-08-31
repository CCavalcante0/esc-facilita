-- Restringe a escrita de notícias ao operador.
--
-- Contexto: a 0002 foi escrita quando "authenticated" significava "alguém do
-- time" — só havia contas do CMS no Supabase Auth. A 0003 (M1) passou a criar
-- contas de CLIENTE no mesmo `auth.users`, e as policies da 0002 não foram
-- reapertadas. O resultado é que qualquer cliente logado podia inserir, editar
-- e APAGAR qualquer notícia, indo direto na API REST com o próprio token — a
-- guarda de papel do /admin não protege, porque o banco é acessado sem passar
-- pela aplicação.
--
-- Verificado antes da correção: um usuário com role='cliente' apagou todas as
-- linhas de `noticias` em uma única chamada.

drop policy if exists "auth_read_noticias"   on public.noticias;
drop policy if exists "auth_insert_noticias" on public.noticias;
drop policy if exists "auth_update_noticias" on public.noticias;
drop policy if exists "auth_delete_noticias" on public.noticias;

-- Leitura: o operador enxerga rascunhos; qualquer outro autenticado (cliente)
-- vê o mesmo que o público — só o que está publicado.
create policy "noticias_select_publicadas_ou_operador"
  on public.noticias for select
  to authenticated
  using (publicada = true or public.is_operador());

create policy "noticias_insert_operador"
  on public.noticias for insert
  to authenticated
  with check (public.is_operador());

-- WITH CHECK além do USING: sem ele, o operador poderia gravar uma linha que
-- deixasse de satisfazer a própria policy.
create policy "noticias_update_operador"
  on public.noticias for update
  to authenticated
  using (public.is_operador())
  with check (public.is_operador());

create policy "noticias_delete_operador"
  on public.noticias for delete
  to authenticated
  using (public.is_operador());
