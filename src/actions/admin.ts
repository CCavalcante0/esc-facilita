"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAuthServerClient } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/config";

export type ActionResult = { ok: true } | { ok: false; error: string };

function onlyDigits(v: string): string {
  return v.replace(/\D/g, "");
}

/**
 * Converte o que o operador digitou em número, aceitando as duas notações que
 * ele pode usar sem pensar: "4.280,00" (pt-BR) e "4280.00".
 *
 * A versão anterior removia TODO ponto como separador de milhar, então
 * "4280.00" virava 428000 — um contrato de R$ 4.280 gravado como R$ 428.000,
 * e uma taxa de "2.5" gravada como 25% ao mês.
 *
 * Regra:
 *   - tem vírgula  -> vírgula é o decimal, pontos são milhar ("1.234,56")
 *   - só pontos, mais de um -> todos são milhar ("1.234.567")
 *   - um ponto só, com 3 dígitos depois -> milhar, pela convenção pt-BR ("4.280")
 *   - um ponto só, nos demais casos -> decimal ("4280.00", "2.5")
 */
function toNumber(v: string): number {
  const s = v.trim().replace(/\s/g, "");
  if (!s) return NaN;

  if (s.includes(",")) {
    return Number(s.replace(/\./g, "").replace(",", "."));
  }

  const pontos = s.split(".").length - 1;
  if (pontos === 0) return Number(s);
  if (pontos > 1) return Number(s.replace(/\./g, ""));

  const decimais = s.length - s.indexOf(".") - 1;
  return Number(decimais === 3 ? s.replace(".", "") : s);
}

/**
 * Cria o login do cliente (Supabase Auth, via service role) + os registros
 * de negócio (perfis, clientes). A senha é aleatória e descartada: o
 * cliente define a própria senha pelo link de "esqueci minha senha" que
 * disparamos no fim — o operador nunca vê nem transmite uma senha.
 */
export async function criarCliente(formData: FormData): Promise<ActionResult> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const cpf = onlyDigits(String(formData.get("cpf") ?? ""));
  const telefone = onlyDigits(String(formData.get("telefone") ?? "")) || null;

  if (nome.length < 3) return { ok: false, error: "Informe o nome completo do cliente." };
  if (!email.includes("@")) return { ok: false, error: "Informe um e-mail válido." };
  if (cpf.length !== 11) return { ok: false, error: "Informe um CPF válido (11 dígitos)." };

  const admin = createAdminSupabase();
  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email,
    password: randomUUID(),
    email_confirm: true,
  });
  if (authError || !authUser.user) {
    const jaExiste = authError?.message?.toLowerCase().includes("already");
    return {
      ok: false,
      error: jaExiste ? "Já existe uma conta com esse e-mail." : "Não foi possível criar o login do cliente.",
    };
  }

  const supabase = await createAuthServerClient();
  const { error: perfilError } = await supabase.from("perfis").insert({
    id: authUser.user.id,
    role: "cliente",
    nome,
  });
  if (perfilError) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    return { ok: false, error: "Não foi possível salvar o perfil do cliente." };
  }

  const { error: clienteError } = await supabase.from("clientes").insert({
    id: authUser.user.id,
    cpf,
    telefone,
  });
  if (clienteError) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    const duplicado = clienteError.message.toLowerCase().includes("duplicate");
    return {
      ok: false,
      error: duplicado ? "Já existe um cliente com esse CPF." : "Não foi possível salvar os dados do cliente.",
    };
  }

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/callback?next=/redefinir-senha`,
  });

  redirect(`/admin/clientes/${authUser.user.id}`);
}

export async function criarContrato(formData: FormData): Promise<ActionResult> {
  const clienteId = String(formData.get("cliente_id") ?? "");
  const numero = String(formData.get("numero") ?? "").trim();
  const saldo = toNumber(String(formData.get("saldo_devedor") ?? ""));
  const taxaRaw = String(formData.get("taxa_juros") ?? "").trim();
  const taxa = taxaRaw ? toNumber(taxaRaw) : null;
  const prazoRaw = String(formData.get("prazo_meses") ?? "").trim();
  const prazo = prazoRaw ? Number(prazoRaw) : null;
  const banco = String(formData.get("banco") ?? "").trim() || null;
  const agencia = String(formData.get("agencia") ?? "").trim() || null;
  const contaDeposito = String(formData.get("conta_deposito") ?? "").trim() || null;

  if (!clienteId) return { ok: false, error: "Cliente inválido." };
  if (!numero) return { ok: false, error: "Informe o número do contrato." };
  if (!Number.isFinite(saldo) || saldo <= 0) {
    return { ok: false, error: "Informe um saldo devedor válido." };
  }
  if (taxa !== null && (!Number.isFinite(taxa) || taxa < 0)) {
    return { ok: false, error: "Informe uma taxa de juros válida." };
  }

  const supabase = await createAuthServerClient();
  const { data, error } = await supabase
    .from("contratos")
    .insert({
      cliente_id: clienteId,
      numero,
      saldo_devedor: saldo,
      taxa_juros: taxa,
      prazo_meses: prazo,
      banco,
      agencia,
      conta_deposito: contaDeposito,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: "Não foi possível criar o contrato." };
  }

  redirect(`/admin/contratos/${data.id}`);
}

export async function criarParcela(formData: FormData): Promise<ActionResult> {
  const contratoId = String(formData.get("contrato_id") ?? "");
  const numero = Number(String(formData.get("numero") ?? ""));
  const valor = toNumber(String(formData.get("valor") ?? ""));
  const vencimento = String(formData.get("vencimento") ?? "");

  if (!contratoId) return { ok: false, error: "Contrato inválido." };
  if (!Number.isFinite(numero) || numero <= 0) {
    return { ok: false, error: "Informe o número da parcela." };
  }
  if (!Number.isFinite(valor) || valor <= 0) {
    return { ok: false, error: "Informe um valor válido." };
  }
  if (!vencimento) return { ok: false, error: "Informe a data de vencimento." };

  const supabase = await createAuthServerClient();
  const { error } = await supabase.from("parcelas").insert({
    contrato_id: contratoId,
    numero,
    valor,
    vencimento,
  });

  if (error) return { ok: false, error: "Não foi possível lançar a parcela." };
  // O contrato aparece nas duas pontas: revalidar só a tela do operador deixava
  // o painel do cliente servindo o valor velho depois da baixa da parcela.
  revalidatePath(`/admin/contratos/${contratoId}`);
  revalidatePath(`/painel/${contratoId}`);
  revalidatePath("/painel");
  return { ok: true };
}

export async function atualizarParcelaStatus(formData: FormData): Promise<ActionResult> {
  const parcelaId = String(formData.get("parcela_id") ?? "");
  const contratoId = String(formData.get("contrato_id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!["paga", "aberto", "atraso"].includes(status)) {
    return { ok: false, error: "Status inválido." };
  }

  const supabase = await createAuthServerClient();
  const { error } = await supabase
    .from("parcelas")
    .update({ status, pago_em: status === "paga" ? new Date().toISOString() : null })
    .eq("id", parcelaId);

  if (error) return { ok: false, error: "Não foi possível atualizar a parcela." };
  // O contrato aparece nas duas pontas: revalidar só a tela do operador deixava
  // o painel do cliente servindo o valor velho depois da baixa da parcela.
  revalidatePath(`/admin/contratos/${contratoId}`);
  revalidatePath(`/painel/${contratoId}`);
  revalidatePath("/painel");
  return { ok: true };
}
