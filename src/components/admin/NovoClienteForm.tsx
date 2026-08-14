"use client";

import { useState, useTransition } from "react";
import { criarCliente } from "@/actions/admin";

function mascararCpf(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function mascararTelefone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.replace(/(\d{0,2})/, "($1");
  if (d.length <= 6) return d.replace(/(\d{2})(\d{0,4})/, "($1) $2");
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/(\d{2})(\d{1})(\d{4})(\d{0,4})/, "($1) $2 $3-$4");
}

export function NovoClienteForm() {
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");

  function handleSubmit(formData: FormData) {
    setErro("");
    startTransition(async () => {
      const res = await criarCliente(formData);
      if (!res.ok) setErro(res.error);
    });
  }

  return (
    <form action={handleSubmit} noValidate>
      <div className="lead-grid">
        <div className="lead-field">
          <label htmlFor="nc-nome">Nome completo</label>
          <input id="nc-nome" name="nome" type="text" autoComplete="off" required />
        </div>
        <div className="lead-field">
          <label htmlFor="nc-email">E-mail</label>
          <input id="nc-email" name="email" type="email" autoComplete="off" required />
        </div>
        <div className="lead-field">
          <label htmlFor="nc-cpf">CPF</label>
          <input
            id="nc-cpf"
            name="cpf"
            type="text"
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => setCpf(mascararCpf(e.target.value))}
            required
          />
        </div>
        <div className="lead-field">
          <label htmlFor="nc-telefone">Telefone (opcional)</label>
          <input
            id="nc-telefone"
            name="telefone"
            type="tel"
            inputMode="tel"
            placeholder="(98) 9 0000-0000"
            value={telefone}
            onChange={(e) => setTelefone(mascararTelefone(e.target.value))}
          />
        </div>
      </div>
      <div className="lead-actions">
        {erro && (
          <div className="lead-erro" role="alert">
            {erro}
          </div>
        )}
        <button type="submit" className="btn btn-azul" disabled={pending}>
          {pending ? "Criando..." : "Criar cliente"}
        </button>
        <p className="lead-nota">
          Criamos o login do cliente e enviamos um e-mail para ele definir a
          própria senha. Nenhuma senha fica visível para o operador.
        </p>
      </div>
    </form>
  );
}
