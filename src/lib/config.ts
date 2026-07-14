/**
 * Configuração central do site.
 *
 * ATENÇÃO — placeholders a substituir ANTES do domínio ir ao ar:
 * - WHATSAPP_NUMBER: número oficial da ESC ainda não definido.
 * - SITE_URL: domínio definitivo ainda não comprado (afeta sitemap, robots e Open Graph).
 * - CONTACT_EMAIL: e-mail profissional será criado junto com o domínio.
 */
export const WHATSAPP_NUMBER = "5598900000000";
export const WHATSAPP_DISPLAY = "(98) 9 0000-0000";
export const SITE_URL = "https://esc-facilita.vercel.app";
export const CONTACT_EMAIL = "contato@escfacilita.com.br";

export const SITE_NAME = "ESC Facilita";

export function waLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
