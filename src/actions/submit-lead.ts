"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export type LeadOrigem = "credito" | "diagnostico";

export interface LeadInput {
  nome: string;
  whatsapp: string;
  valor: string;
  finalidade: string;
  origem: LeadOrigem;
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
  const nome = (input.nome ?? "").trim();
  const whatsappDigits = (input.whatsapp ?? "").replace(/\D/g, "");
  const finalidade = (input.finalidade ?? "").trim();
  const valor = parseValor(input.valor ?? "");

  if (nome.length < 3) {
    return { ok: false, error: "Informe seu nome completo." };
  }
  if (whatsappDigits.length < 10 || whatsappDigits.length > 13) {
    return { ok: false, error: "Informe um WhatsApp válido com DDD." };
  }
  if (input.origem !== "credito" && input.origem !== "diagnostico") {
    return { ok: false, error: "Origem inválida." };
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
