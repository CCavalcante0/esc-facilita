import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Índice dos posts da Escola Facilita.
 *
 * O conteúdo mora em content/escola/*.mdx e é lido do disco em tempo de build
 * (SSG): nenhuma request em runtime, nenhum custo por visita — decisão travada
 * no ROADMAP. Este módulo é server-only por usar `node:fs`.
 *
 * O bloco YAML é lido aqui como DADO (gray-matter) e removido da renderização
 * pelo remark-frontmatter (ver next.config.ts). São dois consumidores do mesmo
 * bloco: se um post aparecer com o YAML visível no corpo, o plugin caiu.
 */

const DIR = path.join(process.cwd(), "content", "escola");

/** Categorias da Escola — cada uma pinta a capa do card com um tom da IDV. */
export const CATEGORIAS = {
  Blog: { rotulo: "Blog · Gratuito", capa: "" },
  Modelos: { rotulo: "Modelos · Download", capa: "c2" },
  Curso: { rotulo: "Curso", capa: "c3" },
} as const;

export type Categoria = keyof typeof CATEGORIAS;

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  categoria: Categoria;
  /** ISO curto (YYYY-MM-DD) — normalizado, porque o YAML pode entregar Date. */
  data: string;
  /** Minutos de leitura, arredondado para cima (mínimo 1). */
  leitura: number;
};

/** ~200 palavras/minuto: média de leitura em português para texto corrido. */
function tempoDeLeitura(corpo: string): number {
  const palavras = corpo.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(palavras / 200));
}

/**
 * O YAML converte `data: 2026-08-09` em Date automaticamente, e `new Date()`
 * interpreta a string como UTC — o que empurra a data um dia para trás em
 * fuso negativo (o nosso). Por isso normalizamos pela parte UTC, nunca local.
 */
function normalizarData(valor: unknown): string {
  if (valor instanceof Date) return valor.toISOString().slice(0, 10);
  const texto = String(valor ?? "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) return texto;
  const d = new Date(texto);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Data inválida no frontmatter: ${JSON.stringify(valor)}`);
  }
  return d.toISOString().slice(0, 10);
}

function lerPost(arquivo: string): PostMeta {
  const slug = arquivo.replace(/\.mdx$/, "");
  const bruto = fs.readFileSync(path.join(DIR, arquivo), "utf8");
  const { data, content } = matter(bruto);

  // Falhar no build é melhor que publicar um post sem title/description: o
  // primeiro caso o desenvolvedor vê, o segundo só o Google vê.
  for (const campo of ["title", "description", "categoria"] as const) {
    if (!data[campo]) {
      throw new Error(`Post ${arquivo}: frontmatter sem "${campo}".`);
    }
  }
  if (!(data.categoria in CATEGORIAS)) {
    throw new Error(
      `Post ${arquivo}: categoria "${data.categoria}" desconhecida. ` +
        `Use uma de: ${Object.keys(CATEGORIAS).join(", ")}.`
    );
  }

  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    categoria: data.categoria as Categoria,
    data: normalizarData(data.data),
    leitura: tempoDeLeitura(content),
  };
}

/** Todos os posts, do mais recente para o mais antigo. */
export function listarPosts(): PostMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(lerPost)
    .sort((a, b) => b.data.localeCompare(a.data));
}

export function buscarPost(slug: string): PostMeta | undefined {
  return listarPosts().find((p) => p.slug === slug);
}

/**
 * Posts relacionados: mesma categoria primeiro, completando com os mais
 * recentes até `limite`. Usado no pé do post para segurar o leitor no site.
 */
export function postsRelacionados(slug: string, limite = 2): PostMeta[] {
  const posts = listarPosts();
  const atual = posts.find((p) => p.slug === slug);
  if (!atual) return [];
  const outros = posts.filter((p) => p.slug !== slug);
  const mesmaCategoria = outros.filter((p) => p.categoria === atual.categoria);
  const resto = outros.filter((p) => p.categoria !== atual.categoria);
  return [...mesmaCategoria, ...resto].slice(0, limite);
}

/** Data por extenso em pt-BR, para exibição (o <time> usa o ISO cru). */
export function dataExtenso(iso: string): string {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(Date.UTC(ano, mes - 1, dia)).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
