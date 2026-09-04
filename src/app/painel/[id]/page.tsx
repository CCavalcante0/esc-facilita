import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAuthServerClient } from "@/lib/supabase/server";
import { formatData, statusEfetivo } from "@/lib/parcelas";
import { waLink } from "@/lib/config";

export const metadata: Metadata = { title: "Meu contrato" };

function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const STATUS_PARCELA: Record<string, { classe: string; texto: string }> = {
  paga: { classe: "tag-ok", texto: "Paga" },
  aberto: { classe: "tag-aberto", texto: "Em aberto" },
  atraso: { classe: "tag-atraso", texto: "Em atraso" },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ContratoDetalhePage({ params }: Props) {
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
    .select("id, numero, valor, vencimento, status, pago_em")
    .eq("contrato_id", id)
    .order("numero", { ascending: true });

  const proximaParcela = (parcelas ?? []).find((p) => p.status !== "paga");
  const contaDeposito = [contrato.banco, contrato.agencia, contrato.conta_deposito]
    .filter(Boolean)
    .join(" · ") || "A combinar com o operador";

  return (
    <div className="painel-card">
      <div className="painel-top">
        <div>
          <div className="painel-quem">Área do cliente</div>
          <div className="painel-nome">{perfil?.nome ?? "Cliente"}</div>
        </div>
        <span className="painel-selo">CONTRATO Nº {contrato.numero}</span>
      </div>
      <div className="painel-body">
        <div className="painel-saldo">
          <div>
            <div className="lbl">Saldo devedor</div>
            <div className="val">{formatBRL(contrato.saldo_devedor)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="lbl">Próximo vencimento</div>
            <div style={{ fontWeight: 700, color: "var(--profundo)" }}>
              {proximaParcela ? formatData(proximaParcela.vencimento) : "—"}
            </div>
          </div>
        </div>
        {(parcelas ?? []).length === 0 ? (
          <p style={{ color: "var(--cinza)", padding: "12px 0" }}>
            Nenhuma parcela lançada ainda.
          </p>
        ) : (
          (parcelas ?? []).map((p, i, arr) => {
            // Deriva o atraso pela data: uma parcela vencida que o operador ainda
            // não marcou aparecia para o cliente como se estivesse em dia.
            const efetivo = statusEfetivo(p.status, p.vencimento);
            const tag = STATUS_PARCELA[efetivo] ?? STATUS_PARCELA.aberto;
            return (
              <div
                key={p.id}
                className="parcela"
                style={i === arr.length - 1 ? { borderBottom: "none" } : undefined}
              >
                <div className="p-info">
                  <span className="p-num">
                    Parcela {String(p.numero).padStart(2, "0")}
                    {contrato.prazo_meses ? `/${contrato.prazo_meses}` : ""}
                  </span>
                  <span className="p-data">
                    {p.status === "paga"
                      ? `Paga em ${formatData((p.pago_em ?? p.vencimento).slice(0, 10))}`
                      : `Vence ${formatData(p.vencimento)}`}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className="p-val">{formatBRL(p.valor)}</span>
                  <span className={`tag ${tag.classe}`}>{tag.texto}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="painel-foot">
        <span className="btn btn-profundo" style={{ flex: 1, textAlign: "center" }}>
          Conta para depósito: {contaDeposito}
        </span>
        <a
          href={waLink(`Olá, sou cliente ESC Facilita (contrato ${contrato.numero}) e preciso falar com o operador.`)}
          target="_blank"
          rel="noopener"
          className="btn btn-borda"
          style={{ background: "#fff", flex: 1, textAlign: "center" }}
        >
          Falar com operador
        </a>
      </div>
    </div>
  );
}
