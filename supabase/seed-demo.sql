-- ─────────────────────────────────────────────────────────────────────────────
-- Seed de demonstração — ESC Facilita
--
-- Preenche UM contrato completo para um cliente que já existe, reproduzindo o
-- mock do hero da landing: 12 parcelas de R$ 535,00, quatro pagas, uma em
-- atraso e o resto em aberto — saldo devedor de R$ 4.280,00.
--
-- ANTES DE RODAR: o cliente precisa existir. Crie-o pelo /admin (é parte da
-- demonstração) e troque o CPF abaixo pelo que você cadastrou.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare
  v_cpf       text := '12345678901';   -- <<< TROQUE pelo CPF do cliente
  v_cliente   uuid;
  v_contrato  uuid;
  v_valor     numeric := 535.00;
  v_venc      date;
  i           int;
begin
  select id into v_cliente from public.clientes where cpf = v_cpf;
  if v_cliente is null then
    raise exception 'Nenhum cliente com CPF %. Cadastre-o no /admin primeiro.', v_cpf;
  end if;

  -- Vencimentos no dia 15. As datas são ancoradas no dia de hoje para que a
  -- 5ª parcela esteja sempre recém-vencida e a 6ª sempre no futuro — assim o
  -- "próximo vencimento" do painel nunca aparece no passado, em qualquer data
  -- em que a demonstração for feita.
  v_venc := (date_trunc('month', current_date) + interval '14 days')::date;
  if v_venc > current_date then
    v_venc := (v_venc - interval '1 month')::date;
  end if;
  v_venc := (v_venc - interval '4 months')::date;

  insert into public.contratos
    (cliente_id, numero, saldo_devedor, taxa_juros, prazo_meses,
     banco, agencia, conta_deposito, status)
  values
    (v_cliente, '0231', 4280.00, 2.9, 12,
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

  raise notice 'Contrato 0231 criado para o CPF % — 4 pagas, 1 em atraso, 7 em aberto.', v_cpf;
end $$;
