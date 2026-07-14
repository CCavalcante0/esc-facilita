import { ImageResponse } from "next/og";

export const alt = "ESC Facilita — Empresa Simples de Crédito";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// OG image gerada com os tokens da IDV (fundo névoa, símbolo do logo em azul Facilita).
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#E7F0FA",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              background: "#1E62AD",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 52,
              fontWeight: 800,
            }}
          >
            esc
          </div>
          <div style={{ color: "#143F66", fontSize: 34, fontWeight: 700 }}>
            ESC Facilita
          </div>
        </div>
        <div
          style={{
            color: "#143F66",
            fontSize: 66,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: 900,
          }}
        >
          Crédito com estrutura para quem empreende de verdade.
        </div>
        <div style={{ color: "#54606B", fontSize: 30, marginTop: 32 }}>
          Empresa Simples de Crédito · LC 167/2019 · São Luís/MA
        </div>
      </div>
    ),
    { ...size }
  );
}
