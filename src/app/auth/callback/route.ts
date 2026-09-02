import { NextResponse } from "next/server";
import { createAuthServerClient } from "@/lib/supabase/server";
import { caminhoInternoSeguro } from "@/lib/redirect-seguro";

/**
 * Destino do link de e-mail (recuperação de senha, convite). Troca o `code`
 * (PKCE) por uma sessão e manda o usuário para onde o fluxo pedir.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Mesma proteção do login: `next` é entrada do usuário e o redirect acontece
  // DEPOIS de a sessão ser gravada nos cookies.
  const next = caminhoInternoSeguro(searchParams.get("next") ?? "/painel", "/painel");

  if (code) {
    const supabase = await createAuthServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?erro=link-invalido`);
}
