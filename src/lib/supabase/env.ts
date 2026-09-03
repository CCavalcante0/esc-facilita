/**
 * Lê as variáveis do Supabase falhando com mensagem legível.
 *
 * Antes, estes dois caminhos usavam `process.env.X!`. Com a variável ausente
 * ou vazia em produção, `createServerClient` recebia `undefined` e estourava
 * lá dentro — a partir do PROXY, em toda request de /painel e /admin, com
 * stack inútil. O site público seguia funcionando (não passa pelo proxy), o
 * que faz o sintoma parecer bug de página em vez de configuração faltando.
 */
export function envSupabase(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    const faltando = [
      !url && "NEXT_PUBLIC_SUPABASE_URL",
      !key && "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ].filter(Boolean).join(" e ");
    throw new Error(
      `Variáveis de ambiente do Supabase não configuradas: ${faltando}. ` +
      "Configure-as no ambiente de deploy (Production e Preview) e refaça o deploy."
    );
  }
  return { url, key };
}
