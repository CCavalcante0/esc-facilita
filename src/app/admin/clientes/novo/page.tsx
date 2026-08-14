import type { Metadata } from "next";
import { NovoClienteForm } from "@/components/admin/NovoClienteForm";

export const metadata: Metadata = { title: "Novo cliente" };

export default function NovoClientePage() {
  return (
    <div className="lead-card" style={{ maxWidth: 640 }}>
      <div className="sec-head" style={{ marginBottom: 22 }}>
        <h1 className="titulo" style={{ fontSize: "clamp(1.4rem,2.6vw,1.8rem)" }}>
          Novo cliente
        </h1>
        <p style={{ fontSize: "0.98rem" }}>
          Cria o login do cliente e o cadastro básico. Contratos e parcelas
          são adicionados depois, na página do cliente.
        </p>
      </div>
      <NovoClienteForm />
    </div>
  );
}
