/** Mock do ESC System — elemento assinatura do hero B2B. */
export function MockEscSystem() {
  return (
    <div>
      <div
        className="mock"
        role="img"
        aria-label="Exemplo do ESC System, painel de gestão da carteira de crédito"
      >
        <div className="mock-top">
          <div>
            <div className="quem">ESC System</div>
            <div className="nome">Painel da carteira</div>
          </div>
          <span className="selo">JULHO/2026</span>
        </div>
        <div className="kpis">
          <div className="kpi">
            <div className="k-lbl">Carteira ativa</div>
            <div className="k-val">R$ 312 mil</div>
          </div>
          <div className="kpi">
            <div className="k-lbl">A receber (mês)</div>
            <div className="k-val">R$ 41,8 mil</div>
          </div>
          <div className="kpi">
            <div className="k-lbl">Inadimplência</div>
            <div className="k-val alerta">4,2%</div>
          </div>
        </div>
        <div className="mock-body">
          <div className="linha-cart">
            <div className="c-info">
              <span className="c-nome">Contrato 0187 · J.S.</span>
              <span className="c-det">Parcela 06/10 · venc. 10/07</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="c-val">R$ 1.240</span>
              <span className="tag tag-ok">Paga</span>
            </div>
          </div>
          <div className="linha-cart">
            <div className="c-info">
              <span className="c-nome">Contrato 0192 · M.R.</span>
              <span className="c-det">Parcela 03/12 · venc. 05/07</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="c-val">R$ 890</span>
              <span className="tag tag-atraso">Atraso 8d</span>
            </div>
          </div>
          <div className="linha-cart" style={{ borderBottom: "none" }}>
            <div className="c-info">
              <span className="c-nome">Contrato 0195 · A.C.</span>
              <span className="c-det">Parcela 01/06 · venc. 20/07</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="c-val">R$ 2.100</span>
              <span className="tag tag-aberto">Em aberto</span>
            </div>
          </div>
        </div>
        <div className="mock-foot">
          <span>Previsão de recebimento · juros · inadimplência</span>
          <strong style={{ color: "var(--profundo)" }}>Tudo documentado</strong>
        </div>
      </div>
      <p className="mock-legenda">
        A carteira que hoje vive em planilha e WhatsApp, organizada em um sistema —
        com registro, contrato e previsibilidade.
      </p>
    </div>
  );
}
