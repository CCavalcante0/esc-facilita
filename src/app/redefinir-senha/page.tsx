import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { RedefinirSenhaForm } from "@/components/RedefinirSenhaForm";

export const metadata: Metadata = { title: "Redefinir senha" };

export default function RedefinirSenhaPage() {
  return (
    <main className="auth-page">
      <div className="wrap auth-wrap">
        <Link href="/" aria-label="ESC Facilita — início" className="auth-logo">
          <Logo variant="cor" />
        </Link>
        <div className="lead-card">
          <div className="sec-head" style={{ marginBottom: 22 }}>
            <h1 className="titulo" style={{ fontSize: "clamp(1.4rem,2.6vw,1.8rem)" }}>
              Redefinir senha
            </h1>
            <p style={{ fontSize: "0.98rem" }}>Escolha uma nova senha para sua conta.</p>
          </div>
          <RedefinirSenhaForm />
        </div>
      </div>
    </main>
  );
}
