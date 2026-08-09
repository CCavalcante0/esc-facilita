import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CATEGORIAS, listarPosts } from "@/lib/escola";

/**
 * 404 do site. Renderiza dentro do layout raiz, então herda header, rodapé,
 * fonte e JSON-LD — nada de tela branca fora da identidade.
 *
 * Em vez de um beco sem saída, oferece as saídas mais prováveis: com o blog
 * no ar, slug errado de post virou um cenário real, então os últimos posts
 * aparecem aqui como rota de fuga.
 */
export const metadata: Metadata = {
  title: "Página não encontrada",
  // A 404 não deve entrar no índice do Google.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const posts = listarPosts().slice(0, 2);

  return (
    <div className="page-b2c">
      <Header variant="b2c" />

      <main id="conteudo">
        <section className="erro-404">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Erro 404</span>
              <h1 className="titulo">Esta página não existe.</h1>
              <p>
                O endereço pode ter mudado, ou o link que você seguiu está
                incorreto. Abaixo estão os caminhos mais usados — e, se preferir
                resolver direto com uma pessoa, é só chamar no WhatsApp.
              </p>
            </div>

            <div className="erro-acoes">
              <Link className="btn btn-azul" href="/">
                Ir para a página inicial
              </Link>
              <Link className="btn btn-borda" href="/#lead">
                Solicitar análise de crédito
              </Link>
              <Link className="btn btn-borda" href="/escola">
                Escola Facilita
              </Link>
            </div>

            {posts.length > 0 && (
              <div className="erro-posts">
                <h2 className="post-rel-titulo">Conteúdos recentes</h2>
                <div className="escola-grid">
                  {posts.map((post, i) => (
                    <Link
                      key={post.slug}
                      className="card-post"
                      data-d={i + 1}
                      href={`/escola/${post.slug}`}
                    >
                      <div
                        className={`capa ${CATEGORIAS[post.categoria].capa}`}
                      ></div>
                      <div className="corpo">
                        <span className="cat">
                          {CATEGORIAS[post.categoria].rotulo}
                        </span>
                        <h3>{post.title}</h3>
                        <p>{post.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer variant="b2c" />
    </div>
  );
}
