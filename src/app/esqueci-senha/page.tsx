import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { EsqueciSenhaForm } from "@/components/EsqueciSenhaForm";

export const metadata: Metadata = { title: "Esqueci minha senha" };

export default function EsqueciSenhaPage() {
  return (
    <main className="auth-page">
      <div className="wrap auth-wrap">
        <Link href="/" aria-label="ESC Facilita — início" className="auth-logo">
          <Logo variant="cor" />
        </Link>
        <div className="lead-card">
          <div className="sec-head" style={{ marginBottom: 22 }}>
            <h1 className="titulo" style={{ fontSize: "clamp(1.4rem,2.6vw,1.8rem)" }}>
              Esqueci minha senha
            </h1>
            <p style={{ fontSize: "0.98rem" }}>
              Informe o e-mail cadastrado pelo seu operador e enviaremos um
              link para você criar uma nova senha.
            </p>
          </div>
          <EsqueciSenhaForm />
        </div>
      </div>
    </main>
  );
}
