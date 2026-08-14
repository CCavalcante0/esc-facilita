import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="wrap auth-wrap">
        <Link href="/" aria-label="ESC Facilita — início" className="auth-logo">
          <Logo variant="cor" />
        </Link>
        <div className="lead-card">
          <div className="sec-head" style={{ marginBottom: 22 }}>
            <h1 className="titulo" style={{ fontSize: "clamp(1.4rem,2.6vw,1.8rem)" }}>
              Entrar
            </h1>
            <p style={{ fontSize: "0.98rem" }}>
              Acesse com o e-mail e a senha criados pelo seu operador.
            </p>
          </div>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
