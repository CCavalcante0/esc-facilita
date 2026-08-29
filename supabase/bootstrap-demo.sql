-- ═════════════════════════════════════════════════════════════════════════════
-- ESC Facilita — bootstrap completo da demonstração
--
-- ANTES DE RODAR, crie os dois usuários no Supabase Studio:
--   Authentication → Users → Add user   (marque "Auto Confirm User" nos dois)
--     1) o operador  — o login que você vai usar na apresentação
--     2) um cliente  — para mostrar o /painel
--   Não precisa copiar UUID: o script acha os dois pelo e-mail.
--
-- Depois preencha os cinco valores abaixo e rode tudo de uma vez no SQL Editor.
-- Rodar de novo é seguro: o script é idempotente.
-- ═════════════════════════════════════════════════════════════════════════════
do $$
declare
  -- ─── PREENCHA AQUI ────────────────────────────────────────────────────────
  v_email_operador text := 'operador@exemplo.com';
  v_nome_operador  text := 'Seu Nome';
  v_email_cliente  text := 'cliente@exemplo.com';
  v_nome_cliente   text := 'Maria Sousa';
  v_cpf_cliente    text := '12345678901';
  -- ──────────────────────────────────────────────────────────────────────────

  v_id_operador uuid;
  v_id_cliente  uuid;
  v_contrato    uuid;
  v_valor       numeric := 535.00;
  v_venc        date;
  i             int;
begin
  select id into v_id_operador from auth.users where email = v_email_operador;
  if v_id_operador is null then
    raise exception 'Não achei o usuário % em Authentication. Crie-o com Add user (Auto Confirm) antes de rodar.', v_email_operador;
  end if;

  select id into v_id_cliente from auth.users where email = v_email_cliente;
  if v_id_cliente is null then
    raise exception 'Não achei o usuário % em Authentication. Crie-o com Add user (Auto Confirm) antes de rodar.', v_email_cliente;
  end if;

  -- ─── Perfis ────────────────────────────────────────────────────────────────
  -- É a linha em `perfis` que destranca o /admin: sem role='operador' o proxy
  -- redireciona para o /painel.
  insert into public.perfis (id, role, nome)
  values (v_id_operador, 'operador', v_nome_operador)
  on conflict (id) do update set role = 'operador', nome = excluded.nome;

  insert into public.perfis (id, role, nome)
  values (v_id_cliente, 'cliente', v_nome_cliente)
  on conflict (id) do update set role = 'cliente', nome = excluded.nome;

  -- `clientes.cpf` é único: se o CPF já for de outra pessoa, avisa em vez de
  -- estourar com erro de constraint.
  if exists (select 1 from public.clientes
              where cpf = v_cpf_cliente and id <> v_id_cliente) then
    raise exception 'O CPF % já está cadastrado para outro cliente. Use outro CPF.', v_cpf_cliente;
  end if;

  insert into public.clientes (id, cpf, telefone)
  values (v_id_cliente, v_cpf_cliente, '98999990000')
  on conflict (id) do update set cpf = excluded.cpf;

  -- ─── Contrato de demonstração ──────────────────────────────────────────────
  -- Reproduz o mock do hero: 12 parcelas de R$ 535,00, saldo de R$ 4.280,00.
  delete from public.contratos where cliente_id = v_id_cliente and numero = '0231';

  -- Vencimentos no dia 15, ancorados em hoje: a 5ª parcela fica sempre
  -- recém-vencida e a 6ª sempre no futuro, em qualquer dia que isto rode.
  v_venc := (date_trunc('month', current_date) + interval '14 days')::date;
  if v_venc > current_date then
    v_venc := (v_venc - interval '1 month')::date;
  end if;
  v_venc := (v_venc - interval '4 months')::date;

  insert into public.contratos
    (cliente_id, numero, saldo_devedor, taxa_juros, prazo_meses,
     banco, agencia, conta_deposito, status)
  values
    (v_id_cliente, '0231', 4280.00, 2.9, 12,
     'Banco do Brasil', '3421-7', '18.902-4', 'ativo')
  returning id into v_contrato;

  for i in 1..12 loop
    insert into public.parcelas (contrato_id, numero, valor, vencimento, status, pago_em)
    values (
      v_contrato, i, v_valor, (v_venc + ((i - 1) || ' months')::interval)::date,
      case when i <= 4 then 'paga' when i = 5 then 'atraso' else 'aberto' end,
      case when i <= 4 then (v_venc + ((i - 1) || ' months')::interval)::timestamptz end
    );
  end loop;

  raise notice 'Pronto. Operador: %  |  Cliente: % (contrato 0231, saldo 4.280,00)',
    v_email_operador, v_email_cliente;
end $$;
