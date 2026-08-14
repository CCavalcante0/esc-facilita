import { NextResponse } from "next/server";
import { createAuthServerClient } from "@/lib/supabase/server";

/**
 * Destino do link de e-mail (recuperação de senha, convite). Troca o `code`
 * (PKCE) por uma sessão e manda o usuário para onde o fluxo pedir.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/painel";

  if (code) {
    const supabase = await createAuthServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?erro=link-invalido`);
}
