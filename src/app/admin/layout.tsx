import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/server";
import { signOut } from "@/actions/auth";
import { Logo } from "@/components/Logo";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: perfil } = await supabase
    .from("perfis")
    .select("nome, role")
    .eq("id", user.id)
    .maybeSingle();
  if (perfil?.role !== "operador") redirect("/painel");

  return (
    <div className="area-app">
      <header className="area-topbar">
        <div className="wrap area-topbar-in">
          <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo variant="cor" />
            <span className="area-topbar-tag">Operador</span>
          </Link>
          <div className="area-topbar-user">
            <span>{perfil?.nome ?? "Operador"}</span>
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
