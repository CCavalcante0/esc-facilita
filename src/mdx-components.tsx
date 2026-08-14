import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * Componentes globais do MDX (exigido pelo @next/mdx no App Router).
 *
 * A tipografia do corpo do post vive no CSS (.prose-esc), não aqui: manter o
 * mapa enxuto evita mandar JS de estilo para o cliente e preserva a nota 100.
 * Só sobrescrevemos o que precisa de comportamento, não de aparência.
 */
const components: MDXComponents = {
  // Link interno vira <Link> (prefetch + navegação client-side); link externo
  // sai com rel de segurança, já que o conteúdo é escrito em markdown solto.
  a: ({ href, children, ...props }) => {
    const url = String(href ?? "");
    const interno = url.startsWith("/") || url.startsWith("#");
    if (interno) {
      return (
        <Link href={url} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
