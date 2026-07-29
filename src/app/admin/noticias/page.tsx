import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSSRClient } from "@/lib/supabase/ssr";
import { NoticiaAdminList } from "@/components/NoticiaAdminList";
import { logout } from "@/actions/auth";

export const metadata: Metadata = {
  title: "Notícias · Painel",
  robots: { index: false, follow: false },
};

export default async function AdminNoticiasPage() {
  const supabase = await createSSRClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabase
    .from("noticias")
    .select("id, titulo, slug, publicada, publicada_em, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <main className="admin-shell">
      <div className="wrap">
        <header className="admin-top">
          <div>
            <span className="eyebrow">Painel</span>
            <h1 className="titulo" style={{ fontSize: "clamp(1.5rem,3vw,2rem)" }}>
              Notícias
            </h1>
            <p className="admin-user">Conectado como {user.email}</p>
          </div>
          <div className="admin-top-acoes">
            <Link href="/admin/noticias/nova" className="btn btn-azul">
              + Nova notícia
            </Link>
            <form action={logout}>
              <button type="submit" className="btn btn-borda">
                Sair
              </button>
            </form>
          </div>
        </header>

        <NoticiaAdminList noticias={data ?? []} />
      </div>
    </main>
  );
}
