"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { definirPublicacao, excluirNoticia } from "@/actions/noticias";

interface Item {
  id: string;
  titulo: string;
  slug: string;
  publicada: boolean;
  publicada_em: string | null;
  updated_at: string;
}

export function NoticiaAdminList({ noticias }: { noticias: Item[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [erro, setErro] = useState("");
  const [ocupadoId, setOcupadoId] = useState<string | null>(null);

  function alternar(item: Item) {
    setErro("");
    setOcupadoId(item.id);
    start(async () => {
      const res = await definirPublicacao(item.id, !item.publicada);
      if (!res.ok) setErro(res.error);
      setOcupadoId(null);
      router.refresh();
    });
  }

  function excluir(item: Item) {
    if (!confirm(`Excluir a notícia "${item.titulo}"? Isso não pode ser desfeito.`)) {
      return;
    }
    setErro("");
    setOcupadoId(item.id);
    start(async () => {
      const res = await excluirNoticia(item.id);
      if (!res.ok) setErro(res.error);
      setOcupadoId(null);
      router.refresh();
    });
  }

  if (noticias.length === 0) {
    return (
      <p className="admin-vazio">
        Nenhuma notícia ainda. Clique em <strong>+ Nova notícia</strong> para
        criar a primeira.
      </p>
    );
  }

  return (
    <>
      {erro && (
        <div className="lead-erro" role="alert" style={{ marginBottom: 16 }}>
          {erro}
        </div>
      )}
      <ul className="admin-lista">
        {noticias.map((n) => (
          <li key={n.id} className="admin-linha">
            <div className="admin-linha-info">
              <span
                className={`admin-tag ${n.publicada ? "admin-tag--pub" : "admin-tag--rasc"}`}
              >
                {n.publicada ? "Publicada" : "Rascunho"}
              </span>
              <div>
                <h2 className="admin-linha-titulo">{n.titulo}</h2>
                <span className="admin-linha-slug">/noticias/{n.slug}</span>
              </div>
            </div>
            <div className="admin-linha-acoes">
              {n.publicada && (
                <Link
                  href={`/noticias/${n.slug}`}
                  target="_blank"
                  rel="noopener"
                  className="admin-btn-link"
                >
                  Ver
                </Link>
              )}
              <Link
                href={`/admin/noticias/${n.id}`}
                className="admin-btn-link"
              >
                Editar
              </Link>
              <button
                type="button"
                className="admin-btn-link"
                onClick={() => alternar(n)}
                disabled={pending && ocupadoId === n.id}
              >
                {n.publicada ? "Despublicar" : "Publicar"}
              </button>
              <button
                type="button"
                className="admin-btn-link admin-btn-perigo"
                onClick={() => excluir(n)}
                disabled={pending && ocupadoId === n.id}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
