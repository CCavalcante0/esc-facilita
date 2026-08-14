"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { atualizarParcelaStatus } from "@/actions/admin";

const OPCOES = [
  { status: "aberto", texto: "Em aberto" },
  { status: "paga", texto: "Paga" },
  { status: "atraso", texto: "Em atraso" },
] as const;

export function ParcelaAcoes({
  parcelaId,
  contratoId,
  statusAtual,
}: {
  parcelaId: string;
  contratoId: string;
  statusAtual: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function marcar(status: string) {
    const fd = new FormData();
    fd.set("parcela_id", parcelaId);
    fd.set("contrato_id", contratoId);
    fd.set("status", status);
    startTransition(async () => {
      await atualizarParcelaStatus(fd);
      router.refresh();
    });
  }

  return (
    <div className="admin-parcela-acoes">
      {OPCOES.map((o) => (
        <button
          key={o.status}
          type="button"
          disabled={pending || statusAtual === o.status}
          onClick={() => marcar(o.status)}
          className="btn btn-borda"
        >
          {o.texto}
        </button>
      ))}
    </div>
  );
}
