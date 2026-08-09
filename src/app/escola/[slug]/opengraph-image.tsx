import { ImageResponse } from "next/og";
import { CATEGORIAS, buscarPost, listarPosts } from "@/lib/escola";

export const alt = "Escola Facilita — ESC Facilita";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mesma convenção da OG da home (src/app/opengraph-image.tsx), com os tokens
// da IDV — só que o título vem do frontmatter do post.
export function generateStaticParams() {
  return listarPosts().map((p) => ({ slug: p.slug }));
}

export default async function PostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = buscarPost(slug);

  const titulo = post?.title ?? "Escola Facilita";
  const rotulo = post ? CATEGORIAS[post.categoria].rotulo : "Escola Facilita";

  // Título longo precisa encolher para não estourar os 630px de altura.
  const tamanhoTitulo = titulo.length > 64 ? 54 : titulo.length > 44 ? 62 : 70;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#E7F0FA",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: "#1E62AD",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 38,
              fontWeight: 800,
            }}
          >
            esc
          </div>
          <div style={{ color: "#143F66", fontSize: 28, fontWeight: 700 }}>
            ESC Facilita
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#1E62AD",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 22,
            }}
          >
            {rotulo}
          </div>
          <div
            style={{
              color: "#143F66",
              fontSize: tamanhoTitulo,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            {titulo}
          </div>
        </div>

        <div style={{ color: "#54606B", fontSize: 26 }}>
          Escola Facilita · Empresa Simples de Crédito · São Luís/MA
        </div>
      </div>
    ),
    { ...size }
  );
}
