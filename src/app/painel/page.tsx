import Link from "next/link";
import type { Metadata } from "next";
import { createAuthServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Meus contratos" };

function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const STATUS_TAG: Record<string, { classe: string; texto: string }> = {
  ativo: { classe: "tag-ok", texto: "Ativo" },
  quitado: { classe: "tag-aberto", texto: "Quitado" },
  inadimplente: { classe: "tag-atraso", texto: "Inadimplente" },
};

export default async function PainelPage() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: contratos } = await supabase
    .from("contratos")
    .select("id, numero, saldo_devedor, status")
    .eq("cliente_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="titulo" style={{ marginBottom: 24 }}>
        Meus contratos
      </h1>
      {!contratos || contratos.length === 0 ? (
        <div className="lead-card">
          <p>Você ainda não tem nenhum contrato vinculado. Fale com seu operador.</p>
        </div>
      ) : (
        <div className="contratos-lista">
          {contratos.map((c) => {
            const tag = STATUS_TAG[c.status] ?? STATUS_TAG.ativo;
            return (
              <Link key={c.id} href={`/painel/${c.id}`} className="contrato-card">
                <span className="contrato-card-selo">CONTRATO Nº {c.numero}</span>
                <div className="contrato-card-saldo">
                  <span className="lbl">Saldo devedor</span>
                  <span className="val">{formatBRL(c.saldo_devedor)}</span>
                </div>
                <span className={`tag ${tag.classe}`}>{tag.texto}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
