export interface FaqItem {
  pergunta: string;
  resposta: string;
}

/** FAQ acessível com details/summary nativo (funciona sem JavaScript). */
export function Faq({ itens }: { itens: FaqItem[] }) {
  return (
    <div className="faq">
      {itens.map((item) => (
        <details key={item.pergunta}>
          <summary>{item.pergunta}</summary>
          <div className="resp">{item.resposta}</div>
        </details>
      ))}
    </div>
  );
}
