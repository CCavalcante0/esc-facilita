import Link from "next/link";
import type { Metadata } from "next";
import { createAuthServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Clientes" };

export default async function AdminPage() {
  const supabase = await createAuthServerClient();

  const { data: clientesRows } = await supabase
    .from("clientes")
    .select("id, cpf, telefone")
    .order("created_at", { ascending: false });

  const ids = (clientesRows ?? []).map((c) => c.id);
  const { data: perfisRows } = ids.length
    ? await supabase.from("perfis").select("id, nome").in("id", ids)
    : { data: [] as { id: string; nome: string }[] };

  const nomesPorId = new Map((perfisRows ?? []).map((p) => [p.id, p.nome]));

  return (
    <div>
      <div className="admin-cabecalho">
        <h1 className="titulo">Clientes</h1>
        <Link href="/admin/clientes/novo" className="btn btn-azul">
          + Novo cliente
        </Link>
      </div>
      {!clientesRows || clientesRows.length === 0 ? (
        <div className="lead-card">
          <p>Nenhum cliente cadastrado ainda.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Telefone</th>
              </tr>
            </thead>
            <tbody>
              {clientesRows.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/admin/clientes/${c.id}`}>{nomesPorId.get(c.id) ?? "—"}</Link>
                  </td>
                  <td>{c.cpf}</td>
                  <td>{c.telefone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
