interface TickerProps {
  itens: string[];
}

/**
 * Faixa com os selos institucionais correndo horizontalmente.
 * O conteúdo é duplicado para o loop ficar contínuo; a cópia é aria-hidden
 * para o leitor de tela não ler tudo duas vezes.
 */
export function Ticker({ itens }: TickerProps) {
  const linha = (aria: boolean) => (
    <ul className="ticker-track" aria-hidden={aria ? undefined : true}>
      {itens.map((item, i) => (
        <li key={`${item}-${i}`}>{item}</li>
      ))}
    </ul>
  );

  return (
    <div className="ticker" role="complementary" aria-label="Selos institucionais">
      <div className="ticker-viewport">
        {linha(true)}
        {linha(false)}
      </div>
    </div>
  );
}
