/**
 * Padrão de linhas de fundo do hero — dá profundidade sem depender de foto.
 * Traços em Azul Facilita com opacidade baixa (dentro dos tokens da IDV).
 * Decorativo: aria-hidden.
 */
export function HeroPattern() {
  return (
    <svg
      className="hero-pattern"
      viewBox="0 0 1440 700"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="#1E62AD" strokeWidth="1.2">
        <path d="M-40 520 C 220 470, 300 300, 520 300 S 900 470, 1120 400 S 1400 180, 1500 210" opacity=".10" />
        <path d="M-40 570 C 230 520, 320 350, 545 350 S 915 515, 1140 445 S 1410 230, 1500 258" opacity=".09" />
        <path d="M-40 620 C 240 575, 340 400, 570 400 S 930 560, 1160 490 S 1420 280, 1500 306" opacity=".08" />
        <path d="M-40 670 C 250 630, 360 450, 595 450 S 945 605, 1180 535 S 1430 330, 1500 354" opacity=".07" />
        <path d="M-40 720 C 260 685, 380 500, 620 500 S 960 650, 1200 580 S 1440 380, 1500 402" opacity=".06" />
        <path d="M-40 200 C 180 150, 420 260, 640 190 S 1020 40, 1260 110 S 1450 190, 1500 175" opacity=".07" />
        <path d="M-40 255 C 190 205, 435 312, 660 242 S 1035 95, 1275 163 S 1455 240, 1500 226" opacity=".05" />
      </g>
      <g fill="#1E62AD">
        <circle cx="520" cy="300" r="4" opacity=".16" />
        <circle cx="1120" cy="400" r="4" opacity=".13" />
        <circle cx="640" cy="190" r="3" opacity=".12" />
      </g>
    </svg>
  );
}
