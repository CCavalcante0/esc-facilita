import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/server";
import { NoticiaEditor } from "@/components/NoticiaEditor";

export const metadata: Metadata = {
  title: "Editar notícia · Painel",
  robots: { index: false, follow: false },
};

export default async function EditarNoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: noticia } = await supabase
    .from("noticias")
    .select("id, titulo, resumo, conteudo, capa_url, publicada")
    .eq("id", id)
    .maybeSingle();

  if (!noticia) notFound();

  return (
    <main className="admin-shell">
      <div className="wrap" style={{ display: "flex", justifyContent: "center" }}>
        <NoticiaEditor
          inicial={{
            id: noticia.id,
            titulo: noticia.titulo,
            resumo: noticia.resumo ?? "",
            conteudo: noticia.conteudo,
            capa_url: noticia.capa_url ?? "",
            publicada: noticia.publicada,
          }}
        />
      </div>
    </main>
  );
}
