import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSSRClient } from "@/lib/supabase/ssr";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Entrar no painel",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const supabase = await createSSRClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/admin/noticias");

  return (
    <main className="admin-shell">
      <div className="wrap" style={{ display: "flex", justifyContent: "center" }}>
        <LoginForm />
      </div>
    </main>
  );
}
