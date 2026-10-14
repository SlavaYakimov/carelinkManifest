# Carelink Manifest — React shell

## Commands (from repo root)

```bash
npm run compile:content   # ARTICLE.md → web/public/site.json (+ dev stub)
npm run dev                 # Vite dev server (run compile:content first)
npm run build               # compile + production dist/ at repo root
npm run preview             # serve dist/
```

## Layout

- `src/App.tsx` — page structure (matches former `tools/build.py` HTML order)
- `public/site.json` — generated runtime payload; do not edit by hand
- `src/content/site.stub.json` — minimal fallback if `/site.json` is missing (~1 KB)
- `public/images`, `public/fonts`, `public/assets` — symlinks to repo root
- `src/interactivity/` — scroll-stage and modal behaviour (ported from legacy `assets/*.js`)
