"use server";

import { headers } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { rateLimitOk } from "@/lib/rate-limit";

export type LeadOrigem = "credito" | "diagnostico";

export interface LeadInput {
  nome: string;
  whatsapp: string;
  valor: string;
  finalidade: string;
  origem: LeadOrigem;
  /** Honeypot: campo invisível para humanos; bot que preencher é descartado. */
  website?: string;
}

export type SubmitLeadResult =
  | { ok: true }
  | { ok: false; error: string };

function parseValor(valor: string): number | null {
  const digits = valor.replace(/[^\d,]/g, "").replace(",", ".");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function submitLead(input: LeadInput): Promise<SubmitLeadResult> {
  // Honeypot preenchido = bot. Responde sucesso sem gravar, para o bot
  // não aprender que foi detectado.
  if (input.website) {
    return { ok: true };
  }

  // Caps de tamanho antes de qualquer processamento: payload gigante é abuso.
  const nome = (input.nome ?? "").slice(0, 120).trim();
  const whatsappDigits = (input.whatsapp ?? "").slice(0, 32).replace(/\D/g, "");
  const finalidade = (input.finalidade ?? "").slice(0, 300).trim();
  const valor = parseValor((input.valor ?? "").slice(0, 32));

  if (nome.length < 3) {
    return { ok: false, error: "Informe seu nome completo." };
  }
  if (whatsappDigits.length < 10 || whatsappDigits.length > 13) {
    return { ok: false, error: "Informe um WhatsApp válido com DDD." };
  }
  if (input.origem !== "credito" && input.origem !== "diagnostico") {
    return { ok: false, error: "Origem inválida." };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  if (!rateLimitOk(ip)) {
    return {
      ok: false,
      error: "Muitas solicitações seguidas. Aguarde alguns minutos e tente de novo.",
    };
  }

  const supabase = createServerSupabase();
  const { error } = await supabase.from("leads").insert({
    nome,
    whatsapp: whatsappDigits,
    valor,
    finalidade: finalidade || null,
    origem: input.origem,
  });

  if (error) {
    console.error("Erro ao gravar lead:", error.message);
    return {
      ok: false,
      error: "Não foi possível registrar sua solicitação agora.",
    };
  }
  return { ok: true };
}
