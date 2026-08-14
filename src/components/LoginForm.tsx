"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/actions/auth";

export function LoginForm() {
  const searchParams = useSearchParams();
  const proximo = searchParams.get("proximo") ?? "";
  const linkInvalido = searchParams.get("erro") === "link-invalido";
  const [erro, setErro] = useState(
    linkInvalido ? "Esse link expirou ou já foi usado. Peça um novo." : ""
  );
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setErro("");
    startTransition(async () => {
      const res = await signIn(formData);
      if (!res.ok) setErro(res.error);
    });
  }

  return (
    <form action={handleSubmit} noValidate>
      <input type="hidden" name="proximo" value={proximo} />
      <div className="lead-field">
        <label htmlFor="lg-email">E-mail</label>
        <input id="lg-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="lead-field" style={{ marginTop: 14 }}>
        <label htmlFor="lg-senha">Senha</label>
        <input
          id="lg-senha"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <div className="lead-actions">
        {erro && (
          <div className="lead-erro" role="alert">
            {erro}
          </div>
        )}
        <button type="submit" className="btn btn-azul" disabled={pending}>
          {pending ? "Entrando..." : "Entrar"}
        </button>
        <p className="lead-nota">
          <Link href="/esqueci-senha">Esqueci minha senha</Link>
        </p>
      </div>
    </form>
  );
}
