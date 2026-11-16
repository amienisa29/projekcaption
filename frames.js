// Lakaran frame storyboard (9:16) dilukis dalam SVG oleh app sendiri — tiada token tambahan.

export const SHOTS = {
  pov_tangan: "POV tangan",
  close_up: "Close-up",
  atas_meja: "Atas meja",
  dalam_kereta: "Dalam kereta",
  muka: "Muka / reaksi",
  banding: "Banding",
  demo: "Demo",
  promo: "Promo",
  cta: "CTA",
};

// Untuk skrip lama / jawapan tanpa "shot": teka dari teks visual.
const GUESS = [
  ["cta", /beg kuning|cta|tekan|keranjang/i],
  ["promo", /promo|harga|diskaun|voucher|11\.11|poster/i],
  ["banding", /banding|vs\b|alternatif|besar.*kecil/i],
  ["dalam_kereta", /kereta|dashboard|gear|stereng|car/i],
  ["muka", /muka|wajah|reaksi|talking|selfie/i],
  ["demo", /demo|cas|charge|guna|test|sapu|before|after/i],
  ["close_up", /close|dekat|zoom|tekstur|detail/i],
  ["atas_meja", /meja|flat ?lay|atas lantai|tabletop/i],
];
export function shotOf(scene) {
  if (SHOTS[scene.shot]) return scene.shot;
  const t = `${scene.visual || ""} ${scene.nota || ""}`;
  for (const [k, re] of GUESS) if (re.test(t)) return k;
  return "pov_tangan";
}

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Warna tetap: frame ni "skrin telefon" gelap dalam kedua-dua tema.
const C = { bg: "#121212", line: "#3a3a3a", skin: "#c99a74", prod: "#f2c230", prod2: "#8a6a10", text: "#ffffff", over: "#f2c230", dim: "#6b6b6b" };

const hand = (x, y, r = 0) => `
  <g transform="translate(${x} ${y}) rotate(${r})">
    <rect x="-9" y="0" width="18" height="70" rx="8" fill="${C.skin}"/>
    <ellipse cx="0" cy="0" rx="17" ry="13" fill="${C.skin}"/>
  </g>`;
const product = (x, y, w = 34, h = 40) => `
  <rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="7" fill="${C.prod}"/>
  <rect x="${x - w / 2 + 5}" y="${y - h / 2 + 5}" width="${w - 10}" height="${h * 0.35}" rx="3" fill="${C.prod2}" opacity=".5"/>`;

const SCENE = {
  pov_tangan: () => hand(70, 118, -12) + product(66, 108),
  close_up: () => `<circle cx="60" cy="96" r="40" fill="none" stroke="${C.dim}" stroke-dasharray="4 4"/>` + product(60, 96, 52, 60),
  atas_meja: () => `<line x1="0" y1="128" x2="120" y2="128" stroke="${C.line}" stroke-width="2"/>` + product(60, 110, 40, 34),
  dalam_kereta: () => `
    <path d="M0 150 Q60 120 120 150" fill="none" stroke="${C.line}" stroke-width="3"/>
    <rect x="44" y="132" width="32" height="40" rx="6" fill="${C.line}"/>
    <rect x="8" y="40" width="104" height="22" rx="5" fill="none" stroke="${C.line}" stroke-width="2"/>` + product(60, 108, 30, 34) + hand(86, 128, -30),
  muka: () => `
    <circle cx="60" cy="78" r="26" fill="${C.skin}"/>
    <circle cx="51" cy="74" r="3" fill="${C.bg}"/><circle cx="69" cy="74" r="3" fill="${C.bg}"/>
    <ellipse cx="60" cy="88" rx="7" ry="5" fill="${C.bg}"/>
    <path d="M24 150 Q60 104 96 150" fill="${C.line}"/>` + product(92, 120, 22, 26),
  banding: () => product(38, 104, 24, 30) + `<rect x="66" y="74" width="40" height="64" rx="7" fill="${C.dim}"/>
    <text x="60" y="152" fill="${C.text}" font-size="11" font-weight="700" text-anchor="middle">VS</text>`,
  demo: () => product(42, 112, 28, 34) + `
    <rect x="74" y="78" width="30" height="56" rx="6" fill="none" stroke="${C.text}" stroke-width="2"/>
    <path d="M56 110 C64 110 64 104 74 104" fill="none" stroke="${C.text}" stroke-width="2"/>
    <rect x="80" y="112" width="18" height="16" rx="2" fill="#38c172"/>`,
  promo: () => `
    <rect x="22" y="48" width="76" height="62" rx="8" fill="#d6453d"/>
    <text x="60" y="88" fill="#fff" font-size="22" font-weight="800" text-anchor="middle">%</text>` + hand(60, 136, 0) + product(60, 124, 28, 30),
  cta: () => `
    <path d="M44 104 h32 l-4 40 h-24 z" fill="${C.prod}"/>
    <path d="M52 104 q8 -16 16 0" fill="none" stroke="${C.prod}" stroke-width="3"/>
    <path d="M60 150 v14 m-7 -7 l7 7 l7 -7" stroke="${C.text}" stroke-width="3" fill="none"/>`,
};

// Perkataan pertama skrip = caption satu-perkataan gaya blueprint.
function captionWord(skrip) {
  const w = String(skrip || "").trim().split(/\s+/)[0] || "";
  return w.replace(/[^\p{L}\p{N}%]/gu, "").toUpperCase().slice(0, 12);
}
function fitText(s, max) {
  s = String(s || "").trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export function frameSVG(scene, index) {
  const shot = shotOf(scene);
  const over = fitText(scene.teks_skrin, 16);
  const cap = captionWord(scene.skrip);
  return `<svg class="frame" viewBox="0 0 120 213" role="img" aria-label="Lakaran babak ${index + 1}: ${esc(SHOTS[shot])}">
    <rect width="120" height="213" rx="12" fill="${C.bg}"/>
    ${SCENE[shot]()}
    ${over ? `<rect x="8" y="16" width="104" height="20" rx="5" fill="#000" opacity=".55"/>
      <text x="60" y="30" fill="${C.over}" font-size="10.5" font-weight="800" text-anchor="middle">${esc(over)}</text>` : ""}
    ${cap ? `<text x="60" y="186" fill="${C.text}" font-size="13" font-weight="900" text-anchor="middle" stroke="#000" stroke-width="3" paint-order="stroke">${esc(cap)}</text>` : ""}
    <text x="8" y="206" fill="${C.dim}" font-size="8" font-weight="700">${esc(SHOTS[shot].toUpperCase())}</text>
    <text x="112" y="206" fill="${C.dim}" font-size="8" font-weight="700" text-anchor="end">${index + 1}</text>
  </svg>`;
}
