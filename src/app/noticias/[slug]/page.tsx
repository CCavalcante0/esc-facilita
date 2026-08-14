import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createServerSupabase } from "@/lib/supabase/server";

export const revalidate = 60;

type Params = { slug: string };

async function buscarNoticia(slug: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("noticias")
    .select("titulo, resumo, conteudo, capa_url, publicada_em")
    .eq("slug", slug)
    .eq("publicada", true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await buscarNoticia(slug);
  if (!noticia) return { title: "Notícia não encontrada" };
  return {
    title: noticia.titulo,
    description: noticia.resumo ?? undefined,
    alternates: { canonical: `/noticias/${slug}` },
    openGraph: {
      type: "article",
      title: noticia.titulo,
      description: noticia.resumo ?? undefined,
      url: `/noticias/${slug}`,
    },
  };
}

function formatarData(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function NoticiaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const noticia = await buscarNoticia(slug);
  if (!noticia) notFound();

  // Conteúdo é texto puro: quebramos em parágrafos por linha em branco.
  // Renderizar como texto (não HTML) evita XSS e respeita a CSP.
  const paragrafos = noticia.conteudo
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="page-b2c">
      <Header variant="b2c" />
      <main>
        <article className="noticia-artigo">
          <div className="wrap wrap--artigo">
            <Link href="/noticias" className="noticia-voltar">
              ← Todas as notícias
            </Link>
            {noticia.publicada_em && (
              <time className="noticia-artigo-data">
                {formatarData(noticia.publicada_em)}
              </time>
            )}
            <h1>{noticia.titulo}</h1>
            {noticia.resumo && (
              <p className="noticia-artigo-resumo">{noticia.resumo}</p>
            )}
            {noticia.capa_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={noticia.capa_url}
                alt=""
                className="noticia-artigo-capa"
              />
            )}
            <div className="noticia-artigo-corpo">
              {paragrafos.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer variant="b2c" />
    </div>
  );
}
