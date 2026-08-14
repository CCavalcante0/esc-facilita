import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/server";
import { signOut } from "@/actions/auth";
import { Logo } from "@/components/Logo";

export default async function PainelLayout({ children }: { children: ReactNode }) {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: perfil } = await supabase
    .from("perfis")
    .select("nome")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="area-app">
      <header className="area-topbar">
        <div className="wrap area-topbar-in">
          <Logo variant="cor" />
          <div className="area-topbar-user">
            <span>{perfil?.nome ?? "Cliente"}</span>
            <form action={signOut}>
              <button type="submit" className="btn btn-borda" style={{ padding: "8px 16px" }}>
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="area-main">
        <div className="wrap">{children}</div>
      </main>
    </div>
  );
}
