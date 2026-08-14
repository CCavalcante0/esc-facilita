import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAuthServerClient } from "@/lib/supabase/server";
import { NovoContratoForm } from "@/components/admin/NovoContratoForm";

export const metadata: Metadata = { title: "Novo contrato" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NovoContratoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createAuthServerClient();

  const { data: cliente } = await supabase
    .from("clientes")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!cliente) notFound();

  const { data: perfil } = await supabase
    .from("perfis")
    .select("nome")
    .eq("id", id)
    .maybeSingle();

  return (
    <div className="lead-card" style={{ maxWidth: 720 }}>
      <div className="sec-head" style={{ marginBottom: 22 }}>
        <h1 className="titulo" style={{ fontSize: "clamp(1.4rem,2.6vw,1.8rem)" }}>
          Novo contrato — {perfil?.nome ?? "Cliente"}
        </h1>
      </div>
      <NovoContratoForm clienteId={id} />
    </div>
  );
}
