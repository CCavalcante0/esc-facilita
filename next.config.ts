import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const dev = process.env.NODE_ENV === "development";

/*
 * CSP: script/style precisam de 'unsafe-inline' porque o Next injeta scripts
 * inline de bootstrap em páginas estáticas (nonce exigiria render dinâmico,
 * que derrubaria o LCP). Mesmo assim a CSP corta script externo, object,
 * frame e form-action fora da origem. Em dev, HMR precisa de eval e ws.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${dev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // /escola/[slug] importa os posts de content/ (fora de src/). Sem fixar o
  // root, o Turbopack infere a raiz a partir do diretório do import dinâmico
  // e passa a tratar content/ como "fora do projeto" — o build passa, o dev
  // quebra. next dev e next build sempre rodam da raiz do projeto.
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    // CSS (~9KB) vira <style> inline: elimina a request render-blocking
    // apontada pelo PageSpeed. Vale a pena: público chega de campanha
    // (primeira visita), não de revisita com cache.
    inlineCss: true,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

/*
 * MDX da Escola Facilita. Os posts moram em content/escola/*.mdx e são
 * importados dinamicamente por /escola/[slug] — não são páginas por si sós,
 * então pageExtensions continua intocado.
 *
 * Plugins declarados como string: o Turbopack (padrão no Next 16) não
 * consegue receber funções JavaScript, só nomes serializáveis.
 * - remark-frontmatter: reconhece o bloco YAML e o remove da renderização
 *   (sem ele o `---` viraria linha horizontal e o YAML viraria texto solto).
 *   Quem lê esse mesmo bloco como dado é o gray-matter, em src/lib/escola.ts.
 * - remark-gfm: tabelas, listas de tarefas e autolinks no corpo do post.
 */
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
  },
});

export default withMDX(nextConfig);
