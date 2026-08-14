"use server";

import { redirect } from "next/navigation";
import { createSSRClient } from "@/lib/supabase/ssr";

export type LoginResult = { ok: true } | { ok: false; error: string };

/**
 * Login do painel via Supabase Auth (e-mail + senha). Roda no servidor: o
 * browser só fala com o Next, mantendo a CSP `connect-src 'self'`.
 */
export async function login(
  email: string,
  senha: string,
): Promise<LoginResult> {
  const cleanEmail = (email ?? "").slice(0, 200).trim().toLowerCase();
  const cleanSenha = (senha ?? "").slice(0, 200);
  if (!cleanEmail || !cleanSenha) {
    return { ok: false, error: "Informe e-mail e senha." };
  }

  const supabase = await createSSRClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: cleanSenha,
  });

  if (error) {
    // Mensagem genérica de propósito: não revela se o e-mail existe.
    return { ok: false, error: "E-mail ou senha inválidos." };
  }
  return { ok: true };
}

export async function logout() {
  const supabase = await createSSRClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
