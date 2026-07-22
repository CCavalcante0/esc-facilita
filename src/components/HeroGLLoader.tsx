"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// O chunk do WebGL só é baixado quando este componente monta (ssr:false).
const HeroGL = dynamic(() => import("./HeroGL"), { ssr: false });

/**
 * Adia o WebGL para depois do `load` + idle do navegador: o download e a
 * compilação do shader acontecem fora do caminho crítico, sem tocar em
 * FCP/LCP/Speed Index. Com prefers-reduced-motion, nunca monta.
 */
export function HeroGLLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const idle = () => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => setReady(true), { timeout: 2000 });
      } else {
        setTimeout(() => setReady(true), 300);
      }
    };

    if (document.readyState === "complete") {
      idle();
      return;
    }
    window.addEventListener("load", idle, { once: true });
    return () => window.removeEventListener("load", idle);
  }, []);

  return ready ? <HeroGL /> : null;
}
