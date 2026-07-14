import type { Config } from "tailwindcss";

/**
 * Tokens da identidade visual ESC Facilita — Manual de Marca 4Brands (2026).
 * Seção 2 do PRD: nenhuma cor ou fonte fora deste sistema.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        azul: "#1E62AD", // Azul Facilita — ação, botões, links, destaques
        profundo: "#143F66", // Azul Profundo — fundos institucionais, contraste
        nevoa: "#E7F0FA", // Azul Névoa — fundos de apoio, cards suaves
        offwhite: "#F7F8F3", // Off White — fundo editorial padrão
        branco: "#FFFFFF",
        preto: "#1D1D1B", // Preto Técnico — texto-base
        cinza: "#54606B", // apoio de texto (derivado das landings aprovadas)
        linha: "#DCE4EC", // bordas e divisores (derivado das landings aprovadas)
        status: {
          ok: "#1B7F4D",
          "ok-bg": "#E3F3EA",
          pend: "#8F6412",
          "pend-bg": "#FBF1DC",
          atraso: "#B23A3A",
          "atraso-bg": "#FBE7E7",
        },
      },
      borderRadius: {
        raio: "12px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
};

export default config;
