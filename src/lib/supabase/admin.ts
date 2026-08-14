import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Client com a service role key — só para operações que exigem privilégio
 * de admin (hoje: criar usuário no Supabase Auth a partir do /admin).
 * Nunca importar isto de um Client Component; RLS não se aplica aqui, então
 * o resto das escritas do /admin usa o client autenticado do operador
 * (ver server.ts) para a proteção continuar valendo no banco.
 */
export function createAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_SECRET_KEY não configurada.");
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
