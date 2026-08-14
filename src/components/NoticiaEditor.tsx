"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { salvarNoticia } from "@/actions/noticias";

export interface NoticiaInicial {
  id?: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  capa_url: string;
  publicada: boolean;
}

export function NoticiaEditor({ inicial }: { inicial?: NoticiaInicial }) {
  const router = useRouter();
  const [titulo, setTitulo] = useState(inicial?.titulo ?? "");
  const [resumo, setResumo] = useState(inicial?.resumo ?? "");
  const [conteudo, setConteudo] = useState(inicial?.conteudo ?? "");
  const [capaUrl, setCapaUrl] = useState(inicial?.capa_url ?? "");
  const [publicada, setPublicada] = useState(inicial?.publicada ?? false);
  const [erro, setErro] = useState("");
  const [pending, start] = useTransition();

  const editando = Boolean(inicial?.id);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    start(async () => {
      const res = await salvarNoticia({
        id: inicial?.id,
        titulo,
        resumo,
        conteudo,
        capa_url: capaUrl,
        publicada,
      });
      if (res.ok) {
        router.push("/admin/noticias");
        router.refresh();
      } else {
        setErro(res.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="lead-card admin-editor" noValidate>
      <div className="sec-head" style={{ marginBottom: 24 }}>
        <h1 className="titulo" style={{ fontSize: "clamp(1.4rem,2.6vw,1.8rem)" }}>
          {editando ? "Editar notícia" : "Nova notícia"}
        </h1>
      </div>

      <div className="lead-field" style={{ marginBottom: 16 }}>
        <label htmlFor="ed-titulo">Título</label>
        <input
          id="ed-titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex.: ESC Facilita amplia atendimento em São Luís"
          required
        />
      </div>

      <div className="lead-field" style={{ marginBottom: 16 }}>
        <label htmlFor="ed-resumo">Resumo (opcional)</label>
        <input
          id="ed-resumo"
          type="text"
          value={resumo}
          onChange={(e) => setResumo(e.target.value)}
          placeholder="Uma linha que aparece na lista e no compartilhamento."
        />
      </div>

      <div className="lead-field" style={{ marginBottom: 16 }}>
        <label htmlFor="ed-conteudo">Conteúdo</label>
        <textarea
          id="ed-conteudo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          rows={14}
          placeholder="Escreva a notícia. Separe parágrafos com uma linha em branco."
          required
        />
      </div>

      <div className="lead-field" style={{ marginBottom: 16 }}>
        <label htmlFor="ed-capa">Imagem de capa (opcional)</label>
        <input
          id="ed-capa"
          type="text"
          value={capaUrl}
          onChange={(e) => setCapaUrl(e.target.value)}
          placeholder="/imagens/noticia.jpg"
        />
        <span className="admin-dica">
          Por segurança (CSP), a imagem precisa estar no próprio site — um caminho
          como <code>/imagens/arquivo.jpg</code> na pasta <code>public</code>.
        </span>
      </div>

      <label className="admin-check">
        <input
          type="checkbox"
          checked={publicada}
          onChange={(e) => setPublicada(e.target.checked)}
        />
        <span>Publicar agora (deixe desmarcado para salvar como rascunho)</span>
      </label>

      <div className="lead-actions">
        {erro && (
          <div className="lead-erro" role="alert">
            {erro}
          </div>
        )}
        <div className="admin-editor-botoes">
          <button type="submit" className="btn btn-azul" disabled={pending}>
            {pending ? "Salvando..." : editando ? "Salvar alterações" : "Salvar"}
          </button>
          <Link href="/admin/noticias" className="btn btn-borda">
            Cancelar
          </Link>
        </div>
      </div>
    </form>
  );
}
