import { Counter } from "./Counter";

/** Mock da Área do Cliente — elemento assinatura do hero B2C. */
export function MockAreaCliente() {
  return (
    <div className="mock-entra">
      {/* .mock-3d existe só para carregar a inclinação em perspectiva: o
          .mock já tem `animation: respira`, que controla o transform dele e
          sobrescreveria qualquer rotação declarada ali. */}
      <div className="mock-3d">
      <div
        className="mock"
        role="img"
        aria-label="Exemplo da área do cliente com o extrato de parcelas do contrato"
      >
        <div className="mock-top">
          <div>
            <div className="quem">Área do cliente</div>
            <div className="nome">Maria Sousa</div>
          </div>
          <span className="selo">CONTRATO Nº 0231</span>
        </div>
        <div className="mock-body">
          <div className="mock-saldo">
            <div>
              <div className="lbl">Saldo devedor</div>
              <div className="val">
                <Counter value={4280} prefix="R$ " decimals={2} />
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="lbl">Próximo vencimento</div>
              <div style={{ fontWeight: 700, color: "var(--profundo)" }}>15/08</div>
            </div>
          </div>
          <div className="parcela">
            <div className="p-info">
              <span className="p-num">Parcela 04/12</span>
              <span className="p-data">Venceu 15/06</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="p-val">R$ 535,00</span>
              <span className="tag tag-ok">Paga</span>
            </div>
          </div>
          <div className="parcela">
            <div className="p-info">
              <span className="p-num">Parcela 05/12</span>
              <span className="p-data">Venceu 15/07</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="p-val">R$ 535,00</span>
              <span className="tag tag-atraso">Em atraso</span>
            </div>
          </div>
          <div className="parcela" style={{ borderBottom: "none" }}>
            <div className="p-info">
              <span className="p-num">Parcela 06/12</span>
              <span className="p-data">Vence 15/08</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="p-val">R$ 535,00</span>
              <span className="tag tag-aberto">Em aberto</span>
            </div>
          </div>
        </div>
        <div className="mock-foot">
          <span className="btn btn-profundo">Conta para depósito</span>
          <span className="btn btn-borda" style={{ background: "#fff" }}>
            Falar com operador
          </span>
        </div>
      </div>
      </div>
      <p className="mock-legenda">
        Sua área de acompanhamento: parcelas, vencimentos, condições e conta para
        depósito — com login e senha individuais.
      </p>
    </div>
  );
}
