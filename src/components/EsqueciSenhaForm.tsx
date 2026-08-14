"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/auth";

export function EsqueciSenhaForm() {
  const [pending, startTransition] = useTransition();
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  function handleSubmit(formData: FormData) {
    setErro("");
    startTransition(async () => {
      const res = await requestPasswordReset(formData);
      if (res.ok) setEnviado(true);
      else setErro(res.error);
    });
  }

  if (enviado) {
    return (
      <div className="lead-sucesso" role="status">
        Se esse e-mail estiver cadastrado, enviamos um link de redefinição de
        senha para ele. Confira também a caixa de spam.
      </div>
    );
  }

  return (
    <form action={handleSubmit} noValidate>
      <div className="lead-field">
        <label htmlFor="es-email">E-mail</label>
        <input id="es-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="lead-actions">
        {erro && (
          <div className="lead-erro" role="alert">
            {erro}
          </div>
        )}
        <button type="submit" className="btn btn-azul" disabled={pending}>
          {pending ? "Enviando..." : "Enviar link de redefinição"}
        </button>
        <p className="lead-nota">
          <Link href="/login">Voltar para o login</Link>
        </p>
      </div>
    </form>
  );
}
