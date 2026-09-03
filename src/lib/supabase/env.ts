/**
 * Lê as credenciais do Supabase usadas pelo servidor.
 *
 * Aceita dois nomes para cada valor, nesta ordem:
 *
 *   SUPABASE_URL              →  NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_PUBLISHABLE_KEY  →  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 *
 * A diferença importa. Variáveis `NEXT_PUBLIC_` são **inlined no bundle
 * durante o `next build`** e ficam congeladas com o valor que existia naquele
 * momento — configurá-las depois no painel de deploy não tem efeito nenhum até
 * que se refaça o build SEM cache. É uma armadilha silenciosa: a variável está
 * lá no painel, e o app continua vendo `undefined`.
 *
 * Sem o prefixo, o valor é lido do ambiente em tempo de execução, então passa a
 * valer no próximo deploy, com ou sem cache de build.
 *
 * Nada aqui precisa ser público: nenhum componente de cliente fala com o
 * Supabase — todo acesso é no servidor. Os nomes `NEXT_PUBLIC_` seguem
 * aceitos por compatibilidade com quem já os tem configurados.
 */
export function envSupabase(): { url: string; key: string } {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    const faltando = [
      !url && "SUPABASE_URL (ou NEXT_PUBLIC_SUPABASE_URL)",
      !key && "SUPABASE_PUBLISHABLE_KEY (ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)",
    ]
      .filter(Boolean)
      .join(" e ");
    throw new Error(
      `Variáveis de ambiente do Supabase não configuradas: ${faltando}. ` +
        "Configure-as no ambiente de deploy (Production e Preview). " +
        "Os nomes sem NEXT_PUBLIC_ são lidos em runtime e valem no próximo " +
        "deploy; os com NEXT_PUBLIC_ exigem build novo sem cache."
    );
  }
  return { url, key };
}
