"use client";

import { useState, useTransition } from "react";
import { updatePassword } from "@/actions/auth";

export function RedefinirSenhaForm() {
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState("");

  function handleSubmit(formData: FormData) {
    const senha = String(formData.get("password") ?? "");
    const confirmar = String(formData.get("confirmar") ?? "");
    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }
    setErro("");
    startTransition(async () => {
      const res = await updatePassword(formData);
      if (!res.ok) setErro(res.error);
    });
  }

  return (
    <form action={handleSubmit} noValidate>
      <div className="lead-field">
        <label htmlFor="rs-senha">Nova senha</label>
        <input
          id="rs-senha"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>
      <div className="lead-field" style={{ marginTop: 14 }}>
        <label htmlFor="rs-confirmar">Confirmar nova senha</label>
        <input
          id="rs-confirmar"
          name="confirmar"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>
      <div className="lead-actions">
        {erro && (
          <div className="lead-erro" role="alert">
            {erro}
          </div>
        )}
        <button type="submit" className="btn btn-azul" disabled={pending}>
          {pending ? "Salvando..." : "Salvar nova senha"}
        </button>
      </div>
    </form>
  );
}
