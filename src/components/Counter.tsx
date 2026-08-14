"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  /** Valor final (número puro). Ex.: 4280 */
  value: number;
  /** Texto antes do número. Ex.: "R$ " */
  prefix?: string;
  /** Texto depois do número. Ex.: "%" ou " mil" */
  suffix?: string;
  /** Casas decimais. Ex.: 2 para 4.280,00 · 1 para 4,2 */
  decimals?: number;
  duration?: number;
}

/**
 * Conta de 0 até `value` quando entra na viewport, uma única vez.
 * Formata em pt-BR. Respeita prefers-reduced-motion (mostra o valor final direto).
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1400,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [atual, setAtual] = useState(0);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sem animação: basta NÃO observar. Enquanto `pronto` for false o render
    // já mostra `value` diretamente (ver `formatado` abaixo), então setar
    // estado aqui seria redundante — e setState síncrono no corpo do efeito
    // dispara renders em cascata (regra react-hooks/set-state-in-effect).
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzido || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        setPronto(true);

        const inicio = performance.now();
        const passo = (agora: number) => {
          const t = Math.min((agora - inicio) / duration, 1);
          // easeOutExpo — desacelera no fim, dá sensação de "assentar"
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setAtual(value * eased);
          if (t < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  const formatado = (pronto ? atual : value).toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref}>
      {prefix}
      {formatado}
      {suffix}
    </span>
  );
}
