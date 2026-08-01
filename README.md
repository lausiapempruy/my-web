# Gerald's Private Web v2

Website pribadi Gerald Jonathan William.
Dibangun pake HTML, CSS, dan Vanilla JS — no framework, no drama.

## Stack

- HTML5 (inline favicon, semantic)
- CSS3 (iOS 26-inspired, pure black/white)
- Vanilla JavaScript ES5
- Font: Inter (rsms.me CDN)

## Struktur

```
/
├── index.html              → Halaman utama + favicon inline
├── style.css               → Global styling
├── app.js                  → Entry point JS, orchestrator
├── security.js             → Security layer (CSP, anti-devtools, dll)
├── package.json            → Config website (sosial, meta, dll)
├── .gitignore
├── README.md
│
├── assets/
│   ├── background.png      → Background hero (taruh sendiri)
│   └── deskripsi/
│       └── desk-singkat.md → Deskripsi pribadi (isi sendiri)
│
├── components/             → Partial HTML per section
│   ├── hero.html
│   ├── deskripsi.html
│   ├── sosial.html
│   └── ads.html
│
└── modules/                → Logic JS per fungsi
    ├── loader.js
    ├── reveal.js
    ├── parallax.js
    ├── md-parser.js
    ├── sosial.js
    └── ads.js
```

## Deploy

Manual via GitHub Pages:
1. Push ke repo
2. Settings → Pages → Branch: `main` / `root`
3. Done

## Config

Edit `package.json` untuk update sosial media dan info site.

---

*Gerald's Private Web v2 — bukan buat sombong.*
