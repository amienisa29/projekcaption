import { CATEGORIES, HOOKS } from "./hooks.js";

/* ---------- storage helpers (selamat walaupun storage disekat) ---------- */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* abaikan */ }
  },
};

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 1600);
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); ta.remove();
  }
  toast("✅ Dah copy!");
}

/* ---------- tabs ---------- */
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b === btn));
    $("#tab-hooks").classList.toggle("hidden", btn.dataset.tab !== "hooks");
    $("#tab-story").classList.toggle("hidden", btn.dataset.tab !== "story");
    store.set("tab", btn.dataset.tab);
    scrollTo({ top: 0 });
  });
});
if (store.get("tab", "hooks") === "story") document.querySelector('.tab[data-tab="story"]').click();

/* =====================================================================
   TAB HOOK
   ===================================================================== */
let favs = new Set(store.get("favs", []));
let activeCat = store.get("cat", "trending");

const FAV_CAT = { id: "favorite", label: "Favorite", icon: "❤️" };

function hooksFor(catId) {
  if (catId === "favorite") {
    const out = [];
    for (const c of CATEGORIES) for (const h of HOOKS[c.id]) if (favs.has(h)) out.push({ text: h, cat: c });
    return out;
  }
  const cat = CATEGORIES.find((c) => c.id === catId);
  return HOOKS[catId].map((text) => ({ text, cat }));
}

function renderChips() {
  const all = [...CATEGORIES, FAV_CAT];
  $("#chips").innerHTML = all.map((c) => {
    const n = c.id === "favorite" ? hooksFor("favorite").length : HOOKS[c.id].length;
    return `<button class="chip ${c.id === activeCat ? "active" : ""}" data-cat="${c.id}">${c.icon} ${c.label} (${n})</button>`;
  }).join("");
}

function renderGrid() {
  const q = $("#search").value.trim().toLowerCase();
  let items;
  let title;
  if (q) {
    items = [];
    for (const c of CATEGORIES) for (const h of HOOKS[c.id]) if (h.toLowerCase().includes(q)) items.push({ text: h, cat: c });
    title = `🔍 Hasil carian`;
  } else {
    items = hooksFor(activeCat);
    const c = [...CATEGORIES, FAV_CAT].find((x) => x.id === activeCat);
    title = `${c.icon} ${c.label}`;
  }
  $("#list-title").textContent = title;
  $("#list-count").textContent = `${items.length} Hook`;
  $("#empty").classList.toggle("hidden", items.length > 0);
  $("#grid").innerHTML = items.map((it, i) => `
    <div class="hook">
      <div class="hook-top">
        <span class="num">${String(i + 1).padStart(2, "0")}</span>
        <span class="tag">${it.cat.icon} ${it.cat.label.toUpperCase()}</span>
      </div>
      <div class="hook-text">${esc(it.text)}</div>
      <div class="hook-actions">
        <button class="btn gold copy" data-text="${esc(it.text)}">📋 Copy Hook</button>
        <button class="btn fav" data-text="${esc(it.text)}" aria-label="Favorite">${favs.has(it.text) ? "❤️" : "🤍"}</button>
      </div>
    </div>`).join("");
}

$("#chips").addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b) return;
  activeCat = b.dataset.cat;
  store.set("cat", activeCat);
  $("#search").value = "";
  renderChips(); renderGrid();
});

$("#grid").addEventListener("click", (e) => {
  const copy = e.target.closest(".copy");
  if (copy) return copyText(copy.dataset.text);
  const fav = e.target.closest(".fav");
  if (fav) {
    const t = fav.dataset.text;
    favs.has(t) ? favs.delete(t) : favs.add(t);
    store.set("favs", [...favs]);
    renderChips(); renderGrid();
  }
});

$("#search").addEventListener("input", renderGrid);
if (![...CATEGORIES, FAV_CAT].some((c) => c.id === activeCat)) activeCat = "trending";
renderChips(); renderGrid();

/* =====================================================================
   TAB STORYBOARD & SKRIP
   ===================================================================== */
const DEFAULT_BLUEPRINT = `BLUEPRINT: "Spec Kontras → Bukti Angka → Promo" (±35 saat, POV tangan, tak tunjuk muka)
Rujukan: video powerbank 10,000mAh dalam kereta.

GAYA KESELURUHAN
- Shot POV tangan je (tak tunjuk muka), setting ikut tempat produk digunakan (cth dalam kereta).
- Setiap shot pendek 1.5–2 saat, tukar angle kerap. Kadang-kadang flash background warna terang (merah/oren) untuk transition.
- Caption SATU PERKATAAN sekali, huruf besar bold putih, tengah bawah skrin, ikut voiceover.
- Motion graphic angka/spec (mAh, mm, %, watt) muncul atas produk.
- Voiceover santai macam cakap dengan kawan, ±2.5 patah perkataan sesaat.

1. HOOK KONTRAS SPEC (0–3s)
   Formula: "Bukan [A], bukan [B], tapi [spec sebenar] dengan [kelebihan yang mengejutkan]."
   Cth: "Bukan 20 ribu, bukan 30 ribu, tapi 10 ribu mAh dengan saiz yang kecil, ringan je."
   Visual: produk dalam tangan + angka spec beranimasi keliling produk.

2. APA YANG KAU DAPAT / FEATURE (3–10s)
   Senaraikan 2–3 feature fizikal, satu shot satu feature.
   Cth: "Dia ada dua kabel siap — satu Type-C, satu Lightning."
   Visual: produk atas tapak tangan + garis ukuran (mm); close-up tarik setiap kabel/bahagian.

3. BUKTI DENGAN ANGKA SEBENAR (10–18s)
   Formula: "Aku [guna/test] [produk] dari [angka] sampai [angka] dalam [masa] je." + reaksi ringkas.
   Cth: "Powerbank ni fast charging tahu. Aku charge iPhone 13 aku daripada 20 sampai 90 persen dalam sejam je. Okey ah, not bad."
   Visual: demo sebenar + overlay angka (watt, % sebelum → selepas).

4. USE CASE / GAYA HIDUP (18–26s)
   Formula: "Saiz [kelebihan], nak letak/guna dalam [tempat 1] boleh, dalam [tempat 2] pun boleh, takde masalah."
   Visual: masukkan produk dalam beg, letak dalam kereta, guna dalam situasi sebenar.

5. POSITIONING / BANDING (26–30s)
   Formula: "[Produk] ni sesuai sangat untuk [peranan] kalau malas nak [masalah dengan alternatif] macam ni."
   Visual: pegang produk alternatif yang besar/leceh sebagai perbandingan.

6. HARGA + PROMO (30–34s)
   Formula: "Harga murah, tapi sekarang ada promo [nama promo] lagi murah."
   Visual: poster/kad promo muncul atas produk.

7. CTA (34–36s)
   "So kalau korang berminat, tekan kuning bawah."
   Visual: tangan tunjuk ke bawah / letak produk, shot penutup.`;

const bpEl = $("#blueprint");
bpEl.value = store.get("blueprint_v2", DEFAULT_BLUEPRINT);
bpEl.addEventListener("input", () => store.set("blueprint_v2", bpEl.value));
$("#bp-reset").addEventListener("click", () => {
  if (!confirm("Reset blueprint ke versi asal?")) return;
  bpEl.value = DEFAULT_BLUEPRINT; store.set("blueprint_v2", DEFAULT_BLUEPRINT);
});

$("#apikey").value = store.get("apikey", "");
$("#save-key").addEventListener("click", () => { store.set("apikey", $("#apikey").value.trim()); toast("🔑 Key disimpan"); });

function setStatus(msg, isErr = false) {
  const s = $("#status");
  s.classList.toggle("hidden", !msg);
  s.classList.toggle("err", isErr);
  s.textContent = msg || "";
}

const SYSTEM_PROMPT = `Kau ialah pakar content TikTok Affiliate Malaysia dan copywriter video pendek.
Tugas kau: (1) buat research ringkas tentang produk guna web search — apa produk tu, fungsi, kelebihan, bahan/spec, harga anggaran di Malaysia (TikTok Shop/Shopee), review orang, dan pain point pembeli; (2) tulis storyboard dan skrip video TikTok yang IKUT STRUKTUR BLUEPRINT yang diberi, babak demi babak.

Peraturan penulisan:
- Bahasa Melayu santai gaya Malaysia (boleh campur sikit English macam orang Malaysia cakap), ayat pendek, senang disebut depan kamera.
- Jangan buat dakwaan palsu atau melampau (contoh dakwaan perubatan "menyembuhkan"). Guna fakta dari research; kalau tak pasti, tulis secara umum.
- Setiap babak: masa, visual/shot (apa nak rakam), skrip voiceover (apa nak cakap), teks atas skrin, dan nota ringkas (props/transition/tips).
- Jumlah masa babak mesti padan dengan durasi video yang diminta. Kalau durasi lain dari blueprint, kekalkan susunan babak dan skala masa ikut nisbah.
- Ikut GAYA KESELURUHAN dalam blueprint (jenis shot, caption, motion graphic) bila tulis visual & nota.
- Contoh ayat dalam blueprint hanya rujukan formula — tulis ayat baru untuk produk ini, jangan salin bulat-bulat.
- Panjang skrip voiceover lebih kurang 2.5 patah perkataan sesaat supaya muat dengan durasi.
- Bahagian "teks_skrin" = angka/spec atau overlay grafik (cth "10,000mAh", "20% → 90%"), bukan caption perkataan.

Selepas research, jawapan AKHIR kau mesti JSON sahaja (tiada teks lain, tiada markdown fence), ikut bentuk ini:
{
  "produk": "nama produk",
  "research": {
    "ringkasan": "2-3 ayat apa produk ni",
    "kelebihan": ["..."],
    "target_audience": ["..."],
    "pain_points": ["..."],
    "harga_anggaran": "cth RM29 - RM39 (atau 'Tidak pasti')"
  },
  "hook_pilihan": ["3 hingga 5 hook alternatif"],
  "storyboard": [
    { "babak": "nama babak ikut blueprint", "masa": "0-3s", "visual": "...", "skrip": "...", "teks_skrin": "...", "nota": "..." }
  ],
  "skrip_penuh": "skrip voiceover penuh dari awal sampai akhir, satu perenggan per babak",
  "caption": "caption TikTok siap copy",
  "hashtag": ["#tanpa", "#space"]
}`;

let Anthropic = null;
async function getClient(apiKey) {
  if (!Anthropic) {
    // SDK rasmi @anthropic-ai/sdk@1.2.0, di-bundle untuk browser (lihat vendor/README.md)
    Anthropic = (await import("./vendor/anthropic-sdk.js")).default;
  }
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try { return JSON.parse(text.slice(start, end + 1)); } catch { return null; }
}

async function generate() {
  const product = $("#product").value.trim();
  if (!product) { setStatus("Letak tajuk produk dulu.", true); $("#product").focus(); return; }
  const apiKey = ($("#apikey").value || store.get("apikey", "")).trim();
  if (!apiKey) {
    setStatus("Masukkan Anthropic API key dalam ⚙️ Tetapan API (bawah).", true);
    document.querySelector("#apikey").closest("details").open = true;
    return;
  }
  store.set("apikey", apiKey);

  const btn = $("#generate");
  btn.disabled = true;
  $("#result").classList.add("hidden");
  setStatus("🔎 Tengah research produk...");

  const userMsg = `Tajuk produk: ${product}
Info tambahan dari aku: ${$("#notes").value.trim() || "(tiada)"}
Durasi video: ${$("#duration").value}
Gaya bahasa: ${$("#tone").value}

BLUEPRINT VIDEO (ikut struktur ni):
"""
${bpEl.value.trim()}
"""`;

  const sources = new Map();
  try {
    const client = await getClient(apiKey);
    const messages = [{ role: "user", content: userMsg }];
    let final;
    // Web search boleh pause turn yang panjang — sambung sampai siap.
    for (let i = 0; i < 5; i++) {
      const stream = client.beta.messages.stream({
        model: "claude-opus-5-5",
        max_tokens: 64000,
        thinking: { type: "adaptive" },
        output_config: { effort: "medium" },
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        system: SYSTEM_PROMPT,
        tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 6 }],
        messages,
      });
      stream.on("streamEvent", (ev) => {
        if (ev.type === "content_block_start") {
          const t = ev.content_block.type;
          if (t === "server_tool_use") setStatus("🔎 Tengah cari maklumat produk di web...");
          else if (t === "text") setStatus("✍️ Tengah tulis storyboard & skrip...");
        }
      });
      final = await stream.finalMessage();
      for (const block of final.content) {
        if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
          for (const r of block.content) if (r.url) sources.set(r.url, r.title || r.url);
        }
      }
      if (final.stop_reason !== "pause_turn") break;
      messages.push({ role: "assistant", content: final.content });
    }

    if (final.stop_reason === "refusal") throw new Error("Permintaan ditolak oleh model. Cuba tukar tajuk/info produk.");
    const text = final.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    const data = extractJson(text);
    const entry = { id: Date.now(), product, data, raw: data ? "" : text, sources: [...sources].slice(0, 8) };
    saveHistory(entry);
    renderResult(entry);
    setStatus(final.stop_reason === "max_tokens" ? "⚠️ Jawapan terpotong — cuba jana semula." : "");
  } catch (err) {
    console.error(err);
    const msg = err?.status === 401 ? "API key tak sah. Semak semula key kau."
      : err?.status === 429 ? "Terlalu banyak request / had kredit. Cuba lagi sekejap."
      : `Ralat: ${err?.message || err}`;
    setStatus(msg, true);
  } finally {
    btn.disabled = false;
  }
}
$("#generate").addEventListener("click", generate);

function scriptAsText(e) {
  const d = e.data;
  if (!d) return e.raw;
  const lines = [`🎬 STORYBOARD: ${d.produk || e.product}`, ""];
  (d.storyboard || []).forEach((s, i) => {
    lines.push(`BABAK ${i + 1}: ${s.babak} (${s.masa})`);
    lines.push(`🎥 Visual: ${s.visual}`);
    lines.push(`🗣️ Skrip: ${s.skrip}`);
    if (s.teks_skrin) lines.push(`🔤 Teks skrin: ${s.teks_skrin}`);
    if (s.nota) lines.push(`📝 Nota: ${s.nota}`);
    lines.push("");
  });
  if (d.caption) lines.push("CAPTION:", d.caption, (d.hashtag || []).join(" "));
  return lines.join("\n");
}

function list(arr) {
  return (arr || []).length ? `<ul>${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : `<p class="muted small">-</p>`;
}

function renderResult(e) {
  const box = $("#result");
  box.classList.remove("hidden");
  const d = e.data;
  if (!d) {
    box.innerHTML = `<div class="card"><div class="res-head"><h2>🎬 ${esc(e.product)}</h2>
      <button class="btn gold" id="copy-all">📋 Copy</button></div>
      <div class="raw section">${esc(e.raw)}</div></div>`;
  } else {
    const r = d.research || {};
    box.innerHTML = `
      <div class="card">
        <div class="res-head"><h2>🔎 Research</h2></div>
        <p class="small">${esc(r.ringkasan)}</p>
        <div class="section"><h3>💎 Kelebihan</h3>${list(r.kelebihan)}</div>
        <div class="section"><h3>🎯 Target audience</h3>${list(r.target_audience)}</div>
        <div class="section"><h3>😩 Pain points</h3>${list(r.pain_points)}</div>
        <div class="section"><h3>💸 Harga anggaran</h3><p class="small">${esc(r.harga_anggaran || "-")}</p></div>
        ${e.sources?.length ? `<div class="section sources"><h3>🔗 Sumber</h3><ul>${e.sources.map(([u, t]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join("")}</ul></div>` : ""}
      </div>

      <div class="card">
        <div class="res-head"><h2>🪝 Pilihan Hook</h2></div>
        ${(d.hook_pilihan || []).map((h) => `
          <div class="scene"><div class="scene-top"><span class="small">${esc(h)}</span>
          <button class="btn gold small-copy" data-text="${esc(h)}" style="font-size:12px;padding:6px 10px">📋</button></div></div>`).join("")}
      </div>

      <div class="card">
        <div class="res-head"><h2>🎬 Storyboard</h2><button class="btn gold" id="copy-all">📋 Copy semua</button></div>
        <div class="section">
          ${(d.storyboard || []).map((s, i) => `
            <div class="scene">
              <div class="scene-top"><b>${i + 1}. ${esc(s.babak)}</b><span class="pill">⏱ ${esc(s.masa)}</span></div>
              <div class="scene-row"><span>🎥 Visual</span><br>${esc(s.visual)}</div>
              <div class="scene-row"><span>🗣️ Skrip</span><div class="vo">${esc(s.skrip)}</div></div>
              ${s.teks_skrin ? `<div class="scene-row"><span>🔤 Teks skrin</span><br>${esc(s.teks_skrin)}</div>` : ""}
              ${s.nota ? `<div class="scene-row"><span>📝 Nota</span><br>${esc(s.nota)}</div>` : ""}
            </div>`).join("")}
        </div>
      </div>

      <div class="card">
        <div class="res-head"><h2>🗣️ Skrip Penuh</h2><button class="btn gold small-copy" data-text="${esc(d.skrip_penuh)}">📋 Copy</button></div>
        <div class="caption-box section">${esc(d.skrip_penuh)}</div>
      </div>

      <div class="card">
        <div class="res-head"><h2>✍️ Caption</h2><button class="btn gold small-copy" data-text="${esc(`${d.caption}\n\n${(d.hashtag || []).join(" ")}`)}">📋 Copy</button></div>
        <div class="caption-box section">${esc(d.caption)}\n\n${esc((d.hashtag || []).join(" "))}</div>
      </div>`;
  }
  box.querySelectorAll(".small-copy").forEach((b) => b.addEventListener("click", () => copyText(b.dataset.text)));
  box.querySelector("#copy-all")?.addEventListener("click", () => copyText(scriptAsText(e)));
  box.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- sejarah ---------- */
function saveHistory(entry) {
  const h = store.get("history", []);
  h.unshift(entry);
  store.set("history", h.slice(0, 20));
  renderHistory();
}
function renderHistory() {
  const h = store.get("history", []);
  $("#history").innerHTML = h.length
    ? h.map((e) => `<div class="hist-item"><span>${esc(e.product)}<br><span class="muted small">${new Date(e.id).toLocaleString("ms-MY")}</span></span>
        <span><button class="btn gold" data-open="${e.id}">Buka</button> <button class="btn ghost" data-del="${e.id}">🗑</button></span></div>`).join("")
    : `<p class="muted small">Belum ada skrip.</p>`;
}
$("#history").addEventListener("click", (ev) => {
  const open = ev.target.closest("[data-open]");
  const del = ev.target.closest("[data-del]");
  const h = store.get("history", []);
  if (open) { const e = h.find((x) => String(x.id) === open.dataset.open); if (e) renderResult(e); }
  if (del) { store.set("history", h.filter((x) => String(x.id) !== del.dataset.del)); renderHistory(); }
});
renderHistory();

/* ---------- pasang ke home screen (PWA) ---------- */
let deferredInstall = null;
const isStandalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
if (!isStandalone) $("#install").classList.remove("hidden");
addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredInstall = e; });
$("#install").addEventListener("click", async () => {
  if (deferredInstall) {
    deferredInstall.prompt();
    const { outcome } = await deferredInstall.userChoice;
    deferredInstall = null;
    if (outcome === "accepted") $("#install").classList.add("hidden");
  } else {
    $("#install-help").classList.remove("hidden");
  }
});
$("#install-help-close").addEventListener("click", () => $("#install-help").classList.add("hidden"));
addEventListener("appinstalled", () => { $("#install").classList.add("hidden"); toast("✅ App dah dipasang!"); });
