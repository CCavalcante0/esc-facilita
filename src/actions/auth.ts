"use server";

import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/config";

export type AuthResult = { ok: true } | { ok: false; error: string };

export async function signIn(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const proximo = String(formData.get("proximo") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Informe e-mail e senha." };
  }

  const supabase = await createAuthServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { ok: false, error: "E-mail ou senha inválidos." };
  }

  const { data: perfil } = await supabase
    .from("perfis")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  const destino = proximo || (perfil?.role === "operador" ? "/admin" : "/painel");
  redirect(destino);
}

export async function signOut() {
  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    return { ok: false, error: "Informe seu e-mail." };
  }

  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/callback?next=/redefinir-senha`,
  });
  if (error) {
    console.error("Erro ao pedir reset de senha:", error.message);
  }
  // Sempre responde sucesso — não revela se o e-mail existe na base.
  return { ok: true };
}

export async function updatePassword(formData: FormData): Promise<AuthResult> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    return { ok: false, error: "A senha precisa ter pelo menos 8 caracteres." };
  }

  const supabase = await createAuthServerClient();
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error || !data.user) {
    return { ok: false, error: "Não foi possível atualizar a senha. Peça um novo link." };
  }

  const { data: perfil } = await supabase
    .from("perfis")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  redirect(perfil?.role === "operador" ? "/admin" : "/painel");
}
