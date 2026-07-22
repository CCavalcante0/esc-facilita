import type { NextConfig } from "next";

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

export default nextConfig;
