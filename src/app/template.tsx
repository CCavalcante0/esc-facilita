/**
 * Template remonta a cada troca de rota (App Router dá key única).
 * O overlay abaixo é recriado a cada navegação → os painéis tocam a animação
 * de "wipe" (cobrir e revelar) uma vez por transição de página.
 *
 * É CSS puro: sem JS, sem risco de hidratação. Fora de suporte / com
 * prefers-reduced-motion, os painéis ficam colapsados (scaleY(0)) e a
 * .page-transition some — nada bloqueia a tela.
 *
 * Observação: navegação por âncora (#lead) NÃO remonta o template (mesma
 * rota), então o wipe só acontece na troca real / ↔ /para-operadores.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page-transition" aria-hidden="true">
        <span className="pt-panel pt-1" />
        <span className="pt-panel pt-2" />
      </div>
      {children}
    </>
  );
}
