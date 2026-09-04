-- Mantém o contrato em sincronia com as suas parcelas.
--
-- Antes disto, `contratos.saldo_devedor` só era escrito na criação do contrato
-- e nunca mais. O operador dava baixa em todas as parcelas e o painel do
-- cliente seguia mostrando a dívida original — o número que mais importa para
-- ele. `contratos.status` também nunca saía de 'ativo': o valor 'quitado'
-- existe no CHECK desde a 0003 e nenhum caminho de código o escrevia.
--
-- A regra vive no banco, e não na aplicação, de propósito: assim vale para
-- qualquer caminho de escrita — o /admin, um script de seed, ou uma correção
-- feita à mão no SQL Editor. Não há como esquecer de chamar.

create or replace function public.recalcular_contrato(p_contrato uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_em_aberto numeric;
  v_total     int;
begin
  select coalesce(sum(valor) filter (where status <> 'paga'), 0),
         count(*)
    into v_em_aberto, v_total
    from public.parcelas
   where contrato_id = p_contrato;

  -- Contrato sem parcelas lançadas ainda: não mexe no saldo que o operador
  -- digitou na criação, senão zeraria o valor antes de existir extrato.
  if v_total = 0 then
    return;
  end if;

  update public.contratos
     set saldo_devedor = v_em_aberto,
         -- Só 'quitado' é automático. 'inadimplente' continua sendo decisão do
         -- operador: rotular um cliente de inadimplente por um dia de atraso
         -- é julgamento de negócio, não de software.
         status = case
                    when v_em_aberto = 0 then 'quitado'
                    when status = 'quitado' then 'ativo'
                    else status
                  end
   where id = p_contrato;
end;
$$;

create or replace function public.parcelas_recalcula_contrato()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.recalcular_contrato(coalesce(new.contrato_id, old.contrato_id));
  return null;
end;
$$;

drop trigger if exists parcelas_sincroniza_contrato on public.parcelas;

create trigger parcelas_sincroniza_contrato
  after insert or update or delete on public.parcelas
  for each row execute function public.parcelas_recalcula_contrato();

-- Corrige os contratos que já existem, para o estado ficar consistente desde já.
do $$
declare r record;
begin
  for r in select id from public.contratos loop
    perform public.recalcular_contrato(r.id);
  end loop;
end $$;
