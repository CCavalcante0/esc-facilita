"use client";

import { useState, useTransition } from "react";
import { criarContrato } from "@/actions/admin";

export function NovoContratoForm({ clienteId }: { clienteId: string }) {
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState("");

  function handleSubmit(formData: FormData) {
    setErro("");
    startTransition(async () => {
      const res = await criarContrato(formData);
      if (!res.ok) setErro(res.error);
    });
  }

  return (
    <form action={handleSubmit} noValidate>
      <input type="hidden" name="cliente_id" value={clienteId} />
      <div className="lead-grid">
        <div className="lead-field">
          <label htmlFor="ct-numero">Número do contrato</label>
          <input id="ct-numero" name="numero" type="text" placeholder="0231" required />
        </div>
        <div className="lead-field">
          <label htmlFor="ct-saldo">Saldo devedor</label>
          <input
            id="ct-saldo"
            name="saldo_devedor"
            type="text"
            inputMode="decimal"
            placeholder="4280,00"
            required
          />
        </div>
        <div className="lead-field">
          <label htmlFor="ct-taxa">Taxa de juros (% a.m., opcional)</label>
          <input id="ct-taxa" name="taxa_juros" type="text" inputMode="decimal" placeholder="2,5" />
        </div>
        <div className="lead-field">
          <label htmlFor="ct-prazo">Prazo (meses, opcional)</label>
          <input id="ct-prazo" name="prazo_meses" type="number" min={1} placeholder="12" />
        </div>
        <div className="lead-field">
          <label htmlFor="ct-banco">Banco (opcional)</label>
          <input id="ct-banco" name="banco" type="text" placeholder="Banco do Brasil" />
        </div>
        <div className="lead-field">
          <label htmlFor="ct-agencia">Agência (opcional)</label>
          <input id="ct-agencia" name="agencia" type="text" placeholder="1234-5" />
        </div>
        <div className="lead-field full">
          <label htmlFor="ct-conta">Conta para depósito (opcional)</label>
          <input id="ct-conta" name="conta_deposito" type="text" placeholder="Conta corrente 00012345-6" />
        </div>
      </div>
      <div className="lead-actions">
        {erro && (
          <div className="lead-erro" role="alert">
            {erro}
          </div>
        )}
        <button type="submit" className="btn btn-azul" disabled={pending}>
          {pending ? "Criando..." : "Criar contrato"}
        </button>
      </div>
    </form>
  );
}
