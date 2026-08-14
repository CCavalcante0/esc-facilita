import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/server";
import { NoticiaEditor } from "@/components/NoticiaEditor";

export const metadata: Metadata = {
  title: "Nova notícia · Painel",
  robots: { index: false, follow: false },
};

export default async function NovaNoticiaPage() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="admin-shell">
      <div className="wrap" style={{ display: "flex", justifyContent: "center" }}>
        <NoticiaEditor />
      </div>
    </main>
  );
}
