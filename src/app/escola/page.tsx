import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CATEGORIAS, dataExtenso, listarPosts } from "@/lib/escola";
import { SITE_NAME, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Escola Facilita — crédito explicado por quem opera",
  description:
    "Base de conhecimento gratuita sobre crédito, comprovação de renda e formalização. Artigos, modelos de contrato e curso para você voltar com a análise aprovada.",
  alternates: { canonical: `${SITE_URL}/escola` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/escola`,
    title: "Escola Facilita — crédito explicado por quem opera",
    description:
      "Artigos, modelos de contrato e curso sobre crédito, comprovação de renda e formalização.",
  },
};

// Lista os posts como CollectionPage: o Google entende /escola como o índice
// da seção editorial, e não como mais uma página institucional.
function jsonLd(posts: ReturnType<typeof listarPosts>) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Escola Facilita",
    url: `${SITE_URL}/escola`,
    description:
      "Base de conhecimento sobre crédito, comprovação de renda e formalização.",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    hasPart: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.data,
      url: `${SITE_URL}/escola/${p.slug}`,
    })),
  };
}

export default function EscolaIndex() {
  const posts = listarPosts();

  return (
    <div className="page-b2c">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd(posts)).replace(/</g, "\\u003c"),
        }}
      />
      <Header variant="b2c" />

      <main>
        <section className="escola-topo">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Escola Facilita</span>
              <h1 className="titulo">
                Crédito negado não é o fim. É o ponto de partida.
              </h1>
              <p>
                Base de conhecimento, modelos de contrato e curso para você
                organizar a renda, formalizar a operação e voltar com a análise
                aprovada. Tudo gratuito.
              </p>
            </div>
          </div>
        </section>

        <section className="escola">
          <div className="wrap">
            {posts.length === 0 ? (
              <p className="escola-vazio">
                Os primeiros conteúdos estão sendo preparados. Volte em breve.
              </p>
            ) : (
              <div className="escola-grid">
                {posts.map((post, i) => (
                  <Link
                    key={post.slug}
                    className="card-post reveal"
                    data-d={(i % 3) + 1}
                    href={`/escola/${post.slug}`}
                  >
                    <div
                      className={`capa ${CATEGORIAS[post.categoria].capa}`}
                    ></div>
                    <div className="corpo">
                      <span className="cat">
                        {CATEGORIAS[post.categoria].rotulo}
                      </span>
                      <h2>{post.title}</h2>
                      <p>{post.description}</p>
                      <span className="meta">
                        <time dateTime={post.data}>
                          {dataExtenso(post.data)}
                        </time>
                        {" · "}
                        {post.leitura} min de leitura
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="escola-cta">
              <Link className="btn btn-azul" href="/#lead">
                Solicitar análise de crédito
              </Link>
              <span className="yt">
                Em breve: canal da ESC Facilita no YouTube, com vídeos curtos e
                didáticos sobre cada etapa.
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="b2c" />
    </div>
  );
}
