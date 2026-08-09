import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  CATEGORIAS,
  buscarPost,
  dataExtenso,
  listarPosts,
  postsRelacionados,
} from "@/lib/escola";
import { SITE_NAME, SITE_URL } from "@/lib/config";

/**
 * Post da Escola Facilita.
 *
 * Todos os slugs são conhecidos em build (generateStaticParams) e
 * dynamicParams=false faz qualquer slug fora da lista cair em 404 — sem
 * render dinâmico, sem função serverless por visita. É o que mantém o blog
 * em SSG puro, conforme a decisão travada no ROADMAP.
 */
export function generateStaticParams() {
  return listarPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = buscarPost(slug);
  if (!post) return {};

  const url = `${SITE_URL}/escola/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.data,
      section: post.categoria,
    },
  };
}

function jsonLd(post: NonNullable<ReturnType<typeof buscarPost>>) {
  const url = `${SITE_URL}/escola/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.data,
    dateModified: post.data,
    inLanguage: "pt-BR",
    articleSection: post.categoria,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    // A OG do post é gerada pela convenção de arquivo ao lado deste page.tsx.
    image: `${url}/opengraph-image`,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = buscarPost(slug);
  if (!post) notFound();

  // O corpo do post é compilado no build; o frontmatter YAML já foi removido
  // pelo remark-frontmatter, então só o conteúdo chega aqui.
  const { default: Corpo } = await import(
    `../../../../content/escola/${slug}.mdx`
  );
  const relacionados = postsRelacionados(slug);

  return (
    <div className="page-b2c">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd(post)).replace(/</g, "\\u003c"),
        }}
      />
      <Header variant="b2c" />

      <main>
        <article className="post">
          <div className="wrap wrap-post">
            <nav className="post-volta" aria-label="Trilha de navegação">
              <Link href="/escola">← Escola Facilita</Link>
            </nav>

            <header className="post-head">
              <span className="cat">{CATEGORIAS[post.categoria].rotulo}</span>
              <h1>{post.title}</h1>
              <p className="post-desc">{post.description}</p>
              <p className="post-meta">
                <time dateTime={post.data}>{dataExtenso(post.data)}</time>
                {" · "}
                {post.leitura} min de leitura
              </p>
            </header>

            <div className="prose-esc">
              <Corpo />
            </div>

            <aside className="post-aviso">
              Conteúdo educativo. Crédito sujeito a análise e aprovação. A ESC
              Facilita nunca solicita pagamento antecipado para liberar
              empréstimo.
            </aside>
          </div>

          {relacionados.length > 0 && (
            <section className="post-rel">
              <div className="wrap">
                <h2 className="post-rel-titulo">Continue lendo</h2>
                <div className="escola-grid">
                  {relacionados.map((rel, i) => (
                    <Link
                      key={rel.slug}
                      className="card-post"
                      data-d={i + 1}
                      href={`/escola/${rel.slug}`}
                    >
                      <div
                        className={`capa ${CATEGORIAS[rel.categoria].capa}`}
                      ></div>
                      <div className="corpo">
                        <span className="cat">
                          {CATEGORIAS[rel.categoria].rotulo}
                        </span>
                        <h3>{rel.title}</h3>
                        <p>{rel.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer variant="b2c" />
    </div>
  );
}
