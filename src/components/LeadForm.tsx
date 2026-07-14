"use client";

import { useState } from "react";
import { submitLead, type LeadOrigem } from "@/actions/submit-lead";
import { waLink } from "@/lib/config";

type Estado = "idle" | "enviando" | "sucesso" | "erro";

const COPY: Record<
  LeadOrigem,
  {
    titulo: string;
    intro: string;
    finalidadePlaceholder: string;
    finalidadeLabel: string;
    botao: string;
    mensagem: (d: DadosMsg) => string;
  }
> = {
  credito: {
    titulo: "Solicite sua análise de crédito",
    intro:
      "Preencha os dados abaixo. Ao enviar, você segue direto para o WhatsApp da ESC Facilita com a sua solicitação já organizada. Crédito sujeito a análise.",
    finalidadeLabel: "Finalidade",
    finalidadePlaceholder: "Capital de giro, equipamento, antecipação...",
    botao: "Enviar e continuar no WhatsApp",
    mensagem: ({ nome, valor, finalidade }) =>
      `Olá, sou ${nome}. Gostaria de solicitar uma análise de crédito${
        valor ? ` no valor de ${valor}` : ""
      }${finalidade ? `, para ${finalidade}` : ""}.`,
  },
  diagnostico: {
    titulo: "Solicite o diagnóstico da sua operação",
    intro:
      "Preencha os dados abaixo. Ao enviar, você segue direto para o WhatsApp da ESC Facilita para agendar o diagnóstico confidencial da sua operação.",
    finalidadeLabel: "Sobre a operação",
    finalidadePlaceholder: "Volume aproximado, situação atual, principal dúvida...",
    botao: "Enviar e continuar no WhatsApp",
    mensagem: ({ nome, valor, finalidade }) =>
      `Olá, sou ${nome}. Quero solicitar o diagnóstico para estruturar minha operação de crédito${
        valor ? ` (volume aproximado ${valor})` : ""
      }${finalidade ? `. ${finalidade}` : ""}.`,
  },
};

function mascararTelefone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.replace(/(\d{0,2})/, "($1");
  if (d.length <= 6) return d.replace(/(\d{2})(\d{0,4})/, "($1) $2");
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/(\d{2})(\d{1})(\d{4})(\d{0,4})/, "($1) $2 $3-$4");
}

function mascararValor(v: string): string {
  const d = v.replace(/\D/g, "");
  if (!d) return "";
  const n = Number(d) / 100;
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function LeadForm({ origem }: { origem: LeadOrigem }) {
  const copy = COPY[origem];
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [valor, setValor] = useState("");
  const [finalidade, setFinalidade] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");
  const [erro, setErro] = useState<string>("");

  function validarCliente(): string | null {
    if (nome.trim().length < 3) return "Informe seu nome completo.";
    const dig = whatsapp.replace(/\D/g, "");
    if (dig.length < 10) return "Informe um WhatsApp válido com DDD.";
    return null;
  }

  function abrirWhatsApp() {
    const msg = copy.mensagem({ nome: nome.trim(), valor, finalidade: finalidade.trim() });
    window.open(waLink(msg), "_blank", "noopener");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const erroLocal = validarCliente();
    if (erroLocal) {
      setEstado("erro");
      setErro(erroLocal);
      return;
    }
    setEstado("enviando");
    setErro("");
    const res = await submitLead({ nome, whatsapp, valor, finalidade, origem });
    if (res.ok) {
      setEstado("sucesso");
      abrirWhatsApp();
    } else {
      // Falha ao gravar não bloqueia o lead: ainda oferecemos o WhatsApp.
      setEstado("erro");
      setErro(res.error);
    }
  }

  return (
    <div className="lead-card">
      <div className="sec-head" style={{ marginBottom: 22 }}>
        <h2 className="titulo" style={{ fontSize: "clamp(1.4rem,2.6vw,1.8rem)" }}>
          {copy.titulo}
        </h2>
        <p style={{ fontSize: "0.98rem" }}>{copy.intro}</p>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="lead-grid">
          <div className="lead-field">
            <label htmlFor="lf-nome">Nome</label>
            <input
              id="lf-nome"
              name="nome"
              type="text"
              autoComplete="name"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="lead-field">
            <label htmlFor="lf-whats">WhatsApp</label>
            <input
              id="lf-whats"
              name="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(98) 9 0000-0000"
              value={whatsapp}
              onChange={(e) => setWhatsapp(mascararTelefone(e.target.value))}
              required
            />
          </div>
          <div className="lead-field">
            <label htmlFor="lf-valor">Valor desejado</label>
            <input
              id="lf-valor"
              name="valor"
              type="text"
              inputMode="numeric"
              placeholder="R$ 0,00"
              value={valor}
              onChange={(e) => setValor(mascararValor(e.target.value))}
            />
          </div>
          <div className="lead-field">
            <label htmlFor="lf-fim">{copy.finalidadeLabel}</label>
            <input
              id="lf-fim"
              name="finalidade"
              type="text"
              placeholder={copy.finalidadePlaceholder}
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value)}
            />
          </div>
        </div>
        <div className="lead-actions">
          {estado === "erro" && (
            <div className="lead-erro" role="alert">
              {erro}{" "}
              <button
                type="button"
                onClick={abrirWhatsApp}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  font: "inherit",
                  textDecoration: "underline",
                  fontWeight: 700,
                  padding: 0,
                }}
              >
                Falar no WhatsApp mesmo assim
              </button>
            </div>
          )}
          {estado === "sucesso" && (
            <div className="lead-sucesso" role="status">
              Solicitação registrada. Abrimos o WhatsApp em uma nova aba —{" "}
              <button
                type="button"
                onClick={abrirWhatsApp}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  font: "inherit",
                  textDecoration: "underline",
                  fontWeight: 700,
                  padding: 0,
                }}
              >
                se não abriu, clique aqui
              </button>
              .
            </div>
          )}
          <button
            type="submit"
            className="btn btn-azul"
            disabled={estado === "enviando"}
          >
            {estado === "enviando" ? "Enviando..." : copy.botao}
          </button>
          <p className="lead-nota">
            Ao enviar, você concorda em ser contatado pela ESC Facilita pelo
            WhatsApp informado. Seus dados são usados apenas para esse
            atendimento.
          </p>
        </div>
      </form>
    </div>
  );
}

interface DadosMsg {
  nome: string;
  valor: string;
  finalidade: string;
}
