import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAuthServerClient } from "@/lib/supabase/server";
import { NovaParcelaForm } from "@/components/admin/NovaParcelaForm";
import { ParcelaAcoes } from "@/components/admin/ParcelaAcoes";

export const metadata: Metadata = { title: "Contrato" };

function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ContratoAdminPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createAuthServerClient();

  const { data: contrato } = await supabase
    .from("contratos")
    .select(
      "id, numero, saldo_devedor, banco, agencia, conta_deposito, taxa_juros, prazo_meses, status, cliente_id"
    )
    .eq("id", id)
    .maybeSingle();
  if (!contrato) notFound();

  const { data: perfil } = await supabase
    .from("perfis")
    .select("nome")
    .eq("id", contrato.cliente_id)
    .maybeSingle();

  const { data: parcelas } = await supabase
    .from("parcelas")
    .select("id, numero, valor, vencimento, status")
    .eq("contrato_id", id)
    .order("numero", { ascending: true });

  return (
    <div>
      <div className="admin-cabecalho">
        <div>
          <h1 className="titulo">Contrato Nº {contrato.numero}</h1>
          <p style={{ color: "var(--cinza)", marginTop: 6 }}>
            <Link href={`/admin/clientes/${contrato.cliente_id}`}>{perfil?.nome ?? "Cliente"}</Link>
            {" · "}Saldo devedor: {formatBRL(contrato.saldo_devedor)}
            {contrato.taxa_juros ? ` · ${contrato.taxa_juros}% a.m.` : ""}
            {contrato.prazo_meses ? ` · ${contrato.prazo_meses}x` : ""}
          </p>
        </div>
      </div>

      <div className="lead-card" style={{ marginBottom: 24 }}>
        <NovaParcelaForm contratoId={id} />
      </div>

      {!parcelas || parcelas.length === 0 ? (
        <div className="lead-card">
          <p>Nenhuma parcela lançada ainda.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Parcela</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {parcelas.map((p) => (
                <tr key={p.id}>
                  <td>{String(p.numero).padStart(2, "0")}</td>
                  <td>{formatBRL(p.valor)}</td>
                  <td>{formatData(p.vencimento)}</td>
                  <td>
                    <ParcelaAcoes parcelaId={p.id} contratoId={id} statusAtual={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
