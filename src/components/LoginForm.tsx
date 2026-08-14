"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    start(async () => {
      const res = await login(email, senha);
      if (res.ok) {
        router.replace("/admin/noticias");
        router.refresh();
      } else {
        setErro(res.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="lead-card admin-login-card" noValidate>
      <div className="sec-head" style={{ marginBottom: 22 }}>
        <h1 className="titulo" style={{ fontSize: "clamp(1.4rem,2.6vw,1.8rem)" }}>
          Painel · Entrar
        </h1>
        <p style={{ fontSize: "0.98rem" }}>
          Acesso restrito à equipe da ESC Facilita.
        </p>
      </div>
      <div className="lead-field" style={{ marginBottom: 16 }}>
        <label htmlFor="lg-email">E-mail</label>
        <input
          id="lg-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="lead-field">
        <label htmlFor="lg-senha">Senha</label>
        <input
          id="lg-senha"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
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
      </div>
    </form>
  );
}
