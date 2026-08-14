import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAuthServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Cliente" };

function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClienteDetalhePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createAuthServerClient();

  const { data: cliente } = await supabase
    .from("clientes")
    .select("id, cpf, telefone")
    .eq("id", id)
    .maybeSingle();
  if (!cliente) notFound();

  const { data: perfil } = await supabase
    .from("perfis")
    .select("nome")
    .eq("id", id)
    .maybeSingle();

  const { data: contratos } = await supabase
    .from("contratos")
    .select("id, numero, saldo_devedor, status")
    .eq("cliente_id", id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="admin-cabecalho">
        <div>
          <h1 className="titulo">{perfil?.nome ?? "Cliente"}</h1>
          <p style={{ color: "var(--cinza)", marginTop: 6 }}>
            CPF {cliente.cpf} {cliente.telefone ? `· ${cliente.telefone}` : ""}
          </p>
        </div>
        <Link href={`/admin/clientes/${id}/contratos/novo`} className="btn btn-azul">
          + Novo contrato
        </Link>
      </div>

      {!contratos || contratos.length === 0 ? (
        <div className="lead-card">
          <p>Nenhum contrato ainda.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Contrato</th>
                <th>Saldo devedor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {contratos.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/admin/contratos/${c.id}`}>Nº {c.numero}</Link>
                  </td>
                  <td>{formatBRL(c.saldo_devedor)}</td>
                  <td style={{ textTransform: "capitalize" }}>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
