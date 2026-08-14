import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSSRClient } from "@/lib/supabase/ssr";
import { NoticiaEditor } from "@/components/NoticiaEditor";

export const metadata: Metadata = {
  title: "Nova notícia · Painel",
  robots: { index: false, follow: false },
};

export default async function NovaNoticiaPage() {
  const supabase = await createSSRClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <main className="admin-shell">
      <div className="wrap" style={{ display: "flex", justifyContent: "center" }}>
        <NoticiaEditor />
      </div>
    </main>
  );
}
