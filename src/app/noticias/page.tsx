import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Notícias",
  description:
    "Novidades, comunicados e atualizações da ESC Facilita — Empresa Simples de Crédito em São Luís/MA.",
  alternates: { canonical: "/noticias" },
  openGraph: {
    title: "Notícias · ESC Facilita",
    description: "Novidades, comunicados e atualizações da ESC Facilita.",
    url: "/noticias",
  },
};

// Publicação aparece em até 60s; a Server Action também revalida na hora ao
// publicar. Assim não há rebuild manual para colocar notícia no ar.
export const revalidate = 60;

function formatarData(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

async function buscarNoticias() {
  const supabase = createServerSupabase();
  // RLS (policy anon) já restringe a publicadas; o filtro deixa a intenção clara.
  const { data } = await supabase
    .from("noticias")
    .select("slug, titulo, resumo, capa_url, publicada_em")
    .eq("publicada", true)
    .order("publicada_em", { ascending: false })
    .limit(60);
  return data ?? [];
}

export default async function NoticiasPage() {
  // Esta página é prerenderizada no build. Uma falha aqui (Supabase fora do ar,
  // ou variáveis de ambiente ausentes no ambiente de build) derrubava o build
  // inteiro; agora ela cai no estado vazio, que a página já sabe renderizar.
  let noticias: Awaited<ReturnType<typeof buscarNoticias>> = [];
  try {
    noticias = await buscarNoticias();
  } catch {
    noticias = [];
  }

  return (
    <div className="page-b2c">
      <Header variant="b2c" />
      <main>
        <section className="noticias-hero">
          <div className="wrap">
            <span className="eyebrow">Sala de imprensa</span>
            <h1>Notícias</h1>
            <p className="sub">
              Comunicados, novidades e atualizações da ESC Facilita.
            </p>
          </div>
        </section>

        <section className="noticias-lista">
          <div className="wrap">
            {noticias.length === 0 ? (
              <p className="noticias-vazio">
                Ainda não há notícias publicadas. Volte em breve.
              </p>
            ) : (
              <ul className="noticias-grid">
                {noticias.map((n) => (
                  <li key={n.slug}>
                    <Link href={`/noticias/${n.slug}`} className="noticia-card">
                      {n.capa_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={n.capa_url}
                          alt=""
                          className="noticia-card-capa"
                          loading="lazy"
                        />
                      ) : (
                        <div className="noticia-card-capa noticia-card-capa--vazia" />
                      )}
                      <div className="noticia-card-corpo">
                        {n.publicada_em && (
                          <time className="noticia-card-data">
                            {formatarData(n.publicada_em)}
                          </time>
                        )}
                        <h2 className="noticia-card-titulo">{n.titulo}</h2>
                        {n.resumo && (
                          <p className="noticia-card-resumo">{n.resumo}</p>
                        )}
                        <span className="noticia-card-link">Ler notícia →</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer variant="b2c" />
    </div>
  );
}
