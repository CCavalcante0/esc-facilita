/**
 * Só deixa passar caminho interno. `proximo` (login) e `next` (callback de
 * e-mail) vêm da query string, e sem isto um link como
 * `/login?proximo=https://site-falso/painel` autenticava de verdade e largava
 * o usuário no destino do atacante — com a sessão já criada nos cookies.
 *
 * Bloqueia URL absoluta ("https://…"), protocol-relative ("//host"), barra
 * invertida (que alguns parsers tratam como "/") e qualquer coisa que não
 * comece com uma barra.
 *
 * Vive fora de `src/actions/auth.ts` porque aquele módulo é "use server": lá,
 * todo export precisa ser uma Server Action async.
 */
export function caminhoInternoSeguro(valor: string, padrao: string): string {
  const v = valor.trim();
  if (!v.startsWith("/")) return padrao;
  if (v.startsWith("//")) return padrao;
  if (v.includes("\\")) return padrao;
  return v;
}
