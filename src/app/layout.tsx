import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL, WHATSAPP_NUMBER } from "@/lib/config";
import "./globals.css";

// Inter oficial via next/font — self-hosted no build (nenhuma requisição ao
// Google em runtime). Mesma família da IDV. Os TTFs oficiais também estão em
// src/fonts/ (referência da IDV); para trocar por next/font/local, basta
// apontar para eles — feito assim aqui para permitir o deploy por upload.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
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

// Dados estruturados (schema.org) — Google/IA entendem quem é a empresa.
// Tudo vem do config.ts: a troca de WhatsApp/domínio no go-live já atualiza aqui.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: SITE_NAME,
  legalName: "ESC FACILITA BRASIL LTDA",
  taxID: "45.617.869/0001-18",
  url: SITE_URL,
  email: CONTACT_EMAIL,
  telephone: `+${WHATSAPP_NUMBER}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "São Luís",
    addressRegion: "MA",
    addressCountry: "BR",
  },
  areaServed: "São Luís e municípios limítrofes",
  description:
    "Empresa Simples de Crédito (LC 167/2019): empréstimo, financiamento e antecipação de recebíveis com capital próprio. Crédito sujeito a análise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          // Sanitização recomendada pela doc do Next: '<' vira <
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
