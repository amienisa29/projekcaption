# HookAffiliate

Web app untuk content TikTok Affiliate. Boleh dipasang kat Home Screen Android (PWA).

## Tab
- **🪝 Hook** — ratusan hook ikut kategori (Trending, Viral, Kesihatan, Skincare, Gadget, Makanan, Automotif, Pertanian, Perfume, Fashion). Cari, copy satu klik, tanda ❤️ favorite (disimpan dalam browser).
- **🎬 Storyboard & Skrip** — letak tajuk produk, AI (Claude + web search) buat research produk, kemudian tulis storyboard babak demi babak + skrip penuh + caption & hashtag, ikut **blueprint video** kau.

## Setup tab Storyboard
1. Dapatkan API key di console.anthropic.com.
2. Buka tab Storyboard → ⚙️ Tetapan API → tampal key → Simpan. Key disimpan dalam browser kau sahaja.
3. Edit **📐 Blueprint video** dengan struktur video kau sendiri (disimpan automatik).

## Tambah / edit hook
Edit array dalam `hooks.js`. Kiraan dalam chip dikemas kini sendiri.

## Buka kat fon (GitHub Pages)
1. GitHub repo → **Settings → Pages** → Source: **Deploy from a branch** → pilih branch yang ada app ni, folder `/ (root)` → **Save**.
2. Tunggu 1–2 minit, buka `https://amienisa29.github.io/projekcaption/` dalam Chrome Android.
3. Tekan **📲 Pasang App** (atau menu ⋮ → *Add to Home screen*).
