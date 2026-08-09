import Link from "next/link";
import { Logo } from "./Logo";
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, waLink } from "@/lib/config";

type Variant = "b2c" | "b2b";

const DADOS: Record<
  Variant,
  { descricao: string; nav: { href: string; label: string }[]; legal: string }
> = {
  b2c: {
    descricao:
      "Empresa Simples de Crédito. Empréstimo, financiamento e antecipação de recebíveis para quem empreende na nossa região.",
    // Âncoras absolutas: este rodapé também aparece em /escola e
    // /escola/[slug]. Mesma razão do Header.
    nav: [
      { href: "/#produtos", label: "Linhas de crédito" },
      { href: "/#como-funciona", label: "Como funciona" },
      { href: "/escola", label: "Escola Facilita" },
      { href: "/#lead", label: "Área do cliente" },
      { href: "/para-operadores", label: "Torne-se uma ESC" },
    ],
    legal:
      "ESC FACILITA BRASIL LTDA · CNPJ 45.617.869/0001-18 · Empresa Simples de Crédito (ESC) nos termos da Lei Complementar nº 167/2019. A ESC opera com capital próprio e atua exclusivamente no município de sua sede e em municípios limítrofes. Crédito sujeito a análise. Condições, taxas e prazos definidos em contrato.",
  },
  b2b: {
    descricao:
      "Estruturação de Empresas Simples de Crédito: abertura, sistema, assessoria contínua e mentoria para quem opera crédito.",
    nav: [
      { href: "#o-que-e", label: "O que é uma ESC" },
      { href: "#metodo", label: "Método" },
      { href: "#entregas", label: "Plano de adesão" },
      { href: "/", label: "Quero crédito" },
    ],
    legal:
      "ESC FACILITA BRASIL LTDA · CNPJ 45.617.869/0001-18 · Empresa Simples de Crédito (ESC) nos termos da Lei Complementar nº 167/2019. Serviços de consultoria, tecnologia e assessoria para estruturação empresarial. A regularização organiza e reduz exposição, mas não elimina obrigações legais. Condições e escopo definidos em contrato após diagnóstico.",
  },
};

export function Footer({ variant }: { variant: Variant }) {
  const { descricao, nav, legal } = DADOS[variant];
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Logo variant="branca" className="foot-logo" />
            <p style={{ marginTop: 14, maxWidth: "30em" }}>{descricao}</p>
            <p className="foot-tag">Regularizar para crescer.</p>
          </div>
          <div>
            <h3>Navegação</h3>
            <ul>
              {nav.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Contato</h3>
            <ul>
              <li>
                <a href={waLink()} target="_blank" rel="noopener">
                  WhatsApp: {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>São Luís – MA</li>
            </ul>
          </div>
        </div>
        <div className="foot-legal">
          {legal}
          {/* Documento legal junto do aviso legal, e não na navegação: aparece
              em toda página independente da variante do rodapé. */}
          <p className="foot-docs">
            <Link href="/privacidade">Política de Privacidade</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
