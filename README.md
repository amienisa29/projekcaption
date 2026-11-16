# HookAffiliate

Web app untuk content TikTok Affiliate. Boleh dipasang kat Home Screen Android (PWA).

## Tab
- **🪝 Hook** — ratusan hook ikut kategori (Trending, Viral, Kesihatan, Skincare, Gadget, Makanan, Automotif, Pertanian, Perfume, Fashion). Cari, copy satu klik, tanda ❤️ favorite (disimpan dalam browser).
- **🎬 Storyboard & Skrip** — letak tajuk produk, AI (Claude + web search) buat research produk, kemudian tulis storyboard babak demi babak + skrip penuh + caption & hashtag, ikut **blueprint video** kau.

## Tab Skrip — tak perlu API key
Guna langganan Claude kau sendiri:
- **Versi claude.ai** (artifact): butang **✨ Jana Skrip** tanya Claude terus guna akaun kau. Research ikut pengetahuan Claude + info yang kau bagi (tiada carian web).
- **Mana-mana versi**: butang **💬 Buka dalam Claude** buka chat baru dalam Claude dengan prompt siap (produk + blueprint). Dalam chat, Claude boleh guna web search untuk research.

Edit **📐 Blueprint video** ikut struktur video kau (disimpan automatik). Blueprint default diambil dari video rujukan powerbank.

## Versi claude.ai
`python3 tools/build-artifact.py` jana `build/artifact.html`; publish bersama `app.js`, `hooks.js`, `style.css`, dengan capability `sample`.

## Tambah / edit hook
Edit array dalam `hooks.js`. Kiraan dalam chip dikemas kini sendiri.

## Buka kat fon (GitHub Pages)
1. GitHub repo → **Settings → Pages** → Source: **Deploy from a branch** → pilih branch yang ada app ni, folder `/ (root)` → **Save**.
2. Tunggu 1–2 minit, buka `https://amienisa29.github.io/projekcaption/` dalam Chrome Android.
3. Tekan **📲 Pasang App** (atau menu ⋮ → *Add to Home screen*).
