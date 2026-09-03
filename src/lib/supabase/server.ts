import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { envSupabase } from "@/lib/supabase/env";

/**
 * Client Supabase para uso exclusivo no servidor (server actions).
 * A tabela leads só permite INSERT via chave publishable (RLS);
 * leitura de leads é restrita ao painel/service role — nunca no site.
 */
export function createServerSupabase() {
  const { url, key } = envSupabase();
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Client Supabase com a sessão do usuário (cookies) — para Server Components,
 * Server Actions e Route Handlers das áreas autenticadas (/painel, /admin).
 * Respeita RLS como o usuário logado: um operador só consegue escrever em
 * clientes/contratos/parcelas porque a policy `is_operador()` deixa.
 */
export async function createAuthServerClient() {
  const cookieStore = await cookies();
  const { url, key } = envSupabase();
  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado de dentro de um Server Component (sem permissão de
            // escrever cookie) — o middleware já renova a sessão nesse caso.
          }
        },
      },
    }
  );
}
