"use client";

import { useState, useTransition } from "react";
import { criarParcela } from "@/actions/admin";

export function NovaParcelaForm({ contratoId }: { contratoId: string }) {
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState("");

  function handleSubmit(formData: FormData) {
    setErro("");
    startTransition(async () => {
      const res = await criarParcela(formData);
      if (!res.ok) setErro(res.error);
    });
  }

  return (
    <form action={handleSubmit} noValidate className="admin-parcela-form">
      <input type="hidden" name="contrato_id" value={contratoId} />
      <div className="lead-field">
        <label htmlFor="pc-numero">Nº</label>
        <input id="pc-numero" name="numero" type="number" min={1} required style={{ width: 80 }} />
      </div>
      <div className="lead-field">
        <label htmlFor="pc-valor">Valor</label>
        <input
          id="pc-valor"
          name="valor"
          type="text"
          inputMode="decimal"
          placeholder="535,00"
          required
          style={{ width: 130 }}
        />
      </div>
      <div className="lead-field">
        <label htmlFor="pc-vencimento">Vencimento</label>
        <input id="pc-vencimento" name="vencimento" type="date" required />
      </div>
      <button type="submit" className="btn btn-borda" disabled={pending} style={{ padding: "12px 20px" }}>
        {pending ? "Lançando..." : "+ Lançar parcela"}
      </button>
      {erro && (
        <div className="lead-erro" role="alert">
          {erro}
        </div>
      )}
    </form>
  );
}
