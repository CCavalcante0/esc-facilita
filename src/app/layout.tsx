import type { Metadata } from "next";
import localFont from "next/font/local";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import "./globals.css";

// Inter oficial (TTFs da IDV), self-hosted via next/font — sem requisição externa.
const inter = localFont({
  src: [
    {
      path: "../fonts/Inter-Variable.ttf",
      style: "normal",
    },
    {
      path: "../fonts/Inter-Italic-Variable.ttf",
      style: "italic",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  weight: "300 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ESC Facilita — Crédito com estrutura para quem empreende",
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Empresa Simples de Crédito. Empréstimo, financiamento e antecipação de recebíveis para CPF e CNPJ, com análise criteriosa, contrato formalizado e acompanhamento online.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
