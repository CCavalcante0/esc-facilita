import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";

/**
 * Client Supabase com sessão via cookies (Supabase Auth) para uso no servidor:
 * Server Components e Server Actions do painel /admin.
 *
 * Diferente de createServerSupabase() (que só insere leads com a chave
 * publishable, sem sessão), este client carrega o JWT do admin logado — o RLS
 * enxerga o papel `authenticated` e libera leitura de rascunhos e escrita de
 * notícias. O login acontece 100% no servidor, então a CSP `connect-src 'self'`
 * do site continua intacta: o browser nunca fala direto com o Supabase.
 */
export async function createSSRClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Variáveis de ambiente do Supabase não configuradas.");
  }
  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Chamado a partir de um Server Component: escrever cookie aqui não é
          // permitido. Ignorado de propósito — o proxy.ts renova a sessão.
        }
      },
    },
  });
}
