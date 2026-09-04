/**
 * Regras de exibição das parcelas, compartilhadas entre o painel do cliente e
 * o do operador — para os dois nunca discordarem sobre a mesma parcela.
 */

export type StatusParcela = "paga" | "aberto" | "atraso";

/**
 * O status efetivo de hoje.
 *
 * `atraso` é gravado no banco só quando o operador marca à mão. Uma parcela que
 * venceu ontem e ninguém tocou continua 'aberto' — e apareceria para o cliente
 * como se estivesse em dia. Marcar automaticamente exigiria um agendador
 * rodando todo dia; derivar na leitura dá o mesmo resultado visível, na hora,
 * sem infraestrutura nova.
 *
 * Só deriva para pior (aberto → atraso). Nunca reclassifica o que o operador
 * decidiu: 'paga' e 'atraso' gravados são respeitados como estão.
 */
export function statusEfetivo(
  status: string,
  vencimento: string,
  hoje: Date = new Date()
): StatusParcela {
  if (status === "paga" || status === "atraso") return status;

  // Compara só a data, no fuso local, para não marcar em atraso uma parcela
  // que vence hoje por causa do horário.
  const hojeISO = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0"),
  ].join("-");

  return vencimento < hojeISO ? "atraso" : "aberto";
}

/** dd/mm/aaaa. Sem o ano, num contrato de 12 ou 24 meses duas parcelas
 *  diferentes aparecem com a mesma data. */
export function formatData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}
