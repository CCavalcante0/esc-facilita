"use server";

import { revalidatePath } from "next/cache";
import { createSSRClient } from "@/lib/supabase/ssr";
import type { TablesUpdate } from "@/lib/database.types";

export interface NoticiaInput {
  id?: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  capa_url: string;
  publicada: boolean;
}

export type SalvarResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

export type AcaoResult = { ok: true } | { ok: false; error: string };

/** Gera slug a partir do título: minúsculo, sem acento, hífens. */
function slugify(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

/**
 * Cria ou atualiza uma notícia. Todas as ações exigem admin autenticado:
 * o RLS já garante isso, mas checamos getUser() antes por defesa em profundidade.
 */
export async function salvarNoticia(
  input: NoticiaInput,
): Promise<SalvarResult> {
  const supabase = await createSSRClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessão expirada. Faça login de novo." };

  const titulo = (input.titulo ?? "").slice(0, 180).trim();
  const resumo = (input.resumo ?? "").slice(0, 400).trim();
  const conteudo = (input.conteudo ?? "").slice(0, 40_000).trim();
  const capa_url = (input.capa_url ?? "").slice(0, 500).trim();

  if (titulo.length < 4) {
    return { ok: false, error: "O título precisa ter ao menos 4 caracteres." };
  }
  if (conteudo.length < 10) {
    return { ok: false, error: "Escreva o conteúdo da notícia." };
  }

  const slug = slugify(titulo);
  if (!slug) {
    return { ok: false, error: "Título inválido para gerar o endereço (slug)." };
  }

  const publicada = Boolean(input.publicada);

  if (input.id) {
    // Update — só mexe em publicada_em quando muda para publicada.
    const patch: TablesUpdate<"noticias"> = {
      titulo,
      resumo: resumo || null,
      conteudo,
      capa_url: capa_url || null,
      publicada,
      slug,
    };
    if (publicada) patch.publicada_em = new Date().toISOString();

    const { error } = await supabase
      .from("noticias")
      .update(patch)
      .eq("id", input.id);
    if (error) return mapError(error.message);
  } else {
    const { error } = await supabase.from("noticias").insert({
      titulo,
      resumo: resumo || null,
      conteudo,
      capa_url: capa_url || null,
      publicada,
      slug,
      publicada_em: publicada ? new Date().toISOString() : null,
    });
    if (error) return mapError(error.message);
  }

  revalidatePath("/noticias");
  revalidatePath(`/noticias/${slug}`);
  revalidatePath("/admin/noticias");
  return { ok: true, slug };
}

export async function definirPublicacao(
  id: string,
  publicada: boolean,
): Promise<AcaoResult> {
  const supabase = await createSSRClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessão expirada. Faça login de novo." };

  const { error } = await supabase
    .from("noticias")
    .update({
      publicada,
      publicada_em: publicada ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) return { ok: false, error: "Não foi possível atualizar agora." };

  revalidatePath("/noticias");
  revalidatePath("/admin/noticias");
  return { ok: true };
}

export async function excluirNoticia(id: string): Promise<AcaoResult> {
  const supabase = await createSSRClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessão expirada. Faça login de novo." };

  const { error } = await supabase.from("noticias").delete().eq("id", id);
  if (error) return { ok: false, error: "Não foi possível excluir agora." };

  revalidatePath("/noticias");
  revalidatePath("/admin/noticias");
  return { ok: true };
}

function mapError(message: string): SalvarResult {
  // 23505 = violação de unicidade do slug.
  if (message.includes("duplicate") || message.includes("unique")) {
    return {
      ok: false,
      error: "Já existe uma notícia com esse título/endereço. Altere o título.",
    };
  }
  return { ok: false, error: "Não foi possível salvar a notícia agora." };
}
