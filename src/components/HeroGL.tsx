"use client";

import { useEffect, useRef } from "react";

/**
 * Fundo WebGL do hero: correntes fluidas nas cores da IDV sobre o mesmo
 * gradiente névoa→offwhite do CSS (o fade-in fica imperceptível).
 *
 * Regras de performance:
 * - WebGL puro, sem three.js (chunk ~5KB vs ~150KB);
 * - carregado pelo HeroGLLoader só depois do load+idle (fora do LCP/FCP);
 * - ~30fps, DPR limitado a 1.5, pausa fora da viewport e com aba oculta;
 * - sem WebGL ou com prefers-reduced-motion, nunca monta — fica o SVG.
 */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `precision mediump float;
uniform vec2 r;
uniform float t;
// Tokens da IDV
const vec3 NEVOA = vec3(0.906, 0.941, 0.980); // #E7F0FA
const vec3 OFF   = vec3(0.969, 0.973, 0.953); // #F7F8F3
const vec3 AZUL  = vec3(0.118, 0.384, 0.678); // #1E62AD
const vec3 PROF  = vec3(0.078, 0.247, 0.400); // #143F66

void main() {
  vec2 uv = gl_FragCoord.xy / r;          // y=0 embaixo, 1 em cima
  float ar = r.x / r.y;
  vec2 q = vec2(uv.x * ar, uv.y);

  // Base = gradiente do CSS (topo névoa -> base offwhite a 55%)
  vec3 col = mix(OFF, NEVOA, smoothstep(0.45, 1.0, uv.y));

  // Três correntes senoidais lentas (as "linhas vivas" da marca)
  float w1 = sin(q.x * 2.2 + t * 0.35) * 0.14 + sin(q.x * 4.7 - t * 0.22) * 0.05;
  float w2 = sin(q.x * 1.6 - t * 0.28 + 1.7) * 0.18 + sin(q.x * 3.9 + t * 0.31) * 0.04;
  float w3 = sin(q.x * 2.9 + t * 0.19 + 3.1) * 0.11;

  float b1 = smoothstep(0.10, 0.0, abs(uv.y - 0.62 - w1));
  float b2 = smoothstep(0.13, 0.0, abs(uv.y - 0.36 - w2));
  float b3 = smoothstep(0.08, 0.0, abs(uv.y - 0.80 - w3));

  col = mix(col, AZUL, b1 * 0.10);
  col = mix(col, PROF, b2 * 0.07);
  col = mix(col, AZUL, b3 * 0.08);

  // Brilho que respira no canto superior direito (onde fica o mock)
  vec2 gc = vec2(0.82 * ar, 0.72 + sin(t * 0.2) * 0.04);
  float g = smoothstep(0.85, 0.0, distance(q, gc));
  col = mix(col, AZUL, g * 0.05);

  gl_FragColor = vec4(col, 1.0);
}`;

export default function HeroGL() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return; // sem WebGL: permanece o padrão SVG

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]), // triângulo cobrindo a tela
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "r");
    const uTime = gl.getUniformLocation(prog, "t");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas);

    let raf = 0;
    let last = 0;
    let shown = false;
    const start = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      if (now - last < 33) return; // ~30fps: metade da energia, mesmo efeito
      last = now;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        canvas.classList.add("gl-on"); // fade-in só após o 1º frame real
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className="hero-gl" aria-hidden="true" />;
}
