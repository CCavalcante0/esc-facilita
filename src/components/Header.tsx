"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { waLink } from "@/lib/config";

type Variant = "b2c" | "b2b";

interface NavItem {
  href: string;
  label: string;
  className?: string;
  external?: boolean;
  style?: React.CSSProperties;
}

const NAV: Record<Variant, { logoHref: string; items: NavItem[] }> = {
  b2c: {
    logoHref: "#topo",
    items: [
      { href: "#produtos", label: "Crédito" },
      { href: "#como-funciona", label: "Como funciona" },
      { href: "#comprovacao", label: "Comprovação de renda" },
      { href: "#escola", label: "Escola Facilita" },
      { href: "#faq", label: "Dúvidas" },
      { href: "/para-operadores", label: "Torne-se uma ESC" },
      {
        href: "#lead",
        label: "Área do cliente",
        className: "btn btn-borda",
        style: { padding: "9px 20px" },
      },
    ],
  },
  b2b: {
    logoHref: "/",
    items: [
      { href: "/", label: "Quero crédito" },
      { href: "#o-que-e", label: "O que é uma ESC" },
      { href: "#metodo", label: "Método" },
      { href: "#entregas", label: "O que entregamos" },
      { href: "#faq", label: "Dúvidas" },
      {
        href: waLink(),
        label: "Solicitar diagnóstico",
        className: "btn btn-azul",
        style: { padding: "9px 20px" },
        external: true,
      },
    ],
  },
};

export function Header({ variant }: { variant: Variant }) {
  const [aberto, setAberto] = useState(false);
  const { logoHref, items } = NAV[variant];
  const close = () => setAberto(false);

  return (
    <header>
      <div className="wrap nav">
        <Link href={logoHref} aria-label="ESC Facilita — início" onClick={close}>
          <Logo variant="cor" />
        </Link>
        <button
          className="menu-btn"
          aria-label="Abrir menu"
          aria-expanded={aberto}
          onClick={() => setAberto((v) => !v)}
        >
          ☰
        </button>
        <ul className={`nav-links${aberto ? " aberto" : ""}`}>
          {items.map((item) => (
            <li key={item.label}>
              {item.external ? (
                <a
                  href={item.href}
                  className={item.className}
                  style={item.style}
                  target="_blank"
                  rel="noopener"
                  onClick={close}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={item.className}
                  style={item.style}
                  onClick={close}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
