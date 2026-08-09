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

// Horizonte abaixo do centro: o plano ocupa só o terço inferior, longe da
// massa de texto. Valores calibrados olhando o hero renderizado.
const float HORIZ = -0.10;

void main() {
  vec2 uv = gl_FragCoord.xy / r;          // y=0 embaixo, 1 em cima
  // Base = gradiente do CSS (topo névoa -> base offwhite a 55%)
  vec3 col = mix(OFF, NEVOA, smoothstep(0.45, 1.0, uv.y));

  // Espaço de câmera: origem no centro, normalizado pela ALTURA (o aspecto
  // sai de graça em x, sem precisar do 'ar' explícito).
  vec2 p = (gl_FragCoord.xy * 2.0 - r) / r.y;

  float d = HORIZ - p.y;  // > 0 abaixo do horizonte

  if (d > 0.002) {
    // Projeção em perspectiva de um plano infinito: z tende ao infinito ao
    // se aproximar do horizonte. É isto que dá volume de verdade — as linhas
    // convergem num ponto de fuga, em vez de serem ondas achatadas.
    float z = 0.55 / d;
    float x = p.x * z;
    float march = z * 2.0 + t * 0.5; // travessas correndo em direção ao olho

    // Névoa exponencial: apaga o que está longe. Além do realismo, é ela que
    // impede o serrilhado das linhas distantes — WebGL1 não tem derivadas
    // (fwidth) sem extensão, então a névoa faz o papel do antialias.
    float fog = exp(-z * 0.24);

    // Longitudinais. A largura cresce com z para manter espessura quase
    // constante na tela, como numa câmera real; a frequência precisa ser
    // alta (3.0) porque a largura de mundo visível perto do olho é pequena.
    float gx = abs(fract(x * 3.0) - 0.5);
    float wx = clamp(0.055 * z, 0.035, 0.48);
    float lx = smoothstep(wx, wx * 0.25, gx);

    // Travessas
    float gz = abs(fract(march) - 0.5);
    float lz = smoothstep(0.45, 0.10, gz);

    float grade = max(lx * 0.9, lz * 0.55) * fog;
    // Quase apagado sob a coluna de texto (esquerda), presente à direita:
    // o contraste do corpo de texto vem antes do efeito.
    grade *= mix(0.12, 1.0, smoothstep(-1.0, 0.35, p.x));

    col = mix(col, AZUL, grade * 0.26);
  }

  // Luz volumétrica no ponto de fuga: a profundidade vem da luz, não de um
  // objeto flutuando — mesma leitura de Mercury e Stripe.
  vec2 fuga = vec2(0.35, HORIZ);
  float dist = distance(p, fuga);
  col = mix(col, vec3(1.0), exp(-dist * 2.0) * 0.45);
  col = mix(col, AZUL, exp(-dist * 0.8) * 0.06);

  // Atmosfera acima do horizonte, respirando devagar.
  float ceu = smoothstep(HORIZ - 0.05, HORIZ + 0.9, p.y);
  col = mix(col, PROF, ceu * (0.02 + 0.012 * sin(t * 0.25)));

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
