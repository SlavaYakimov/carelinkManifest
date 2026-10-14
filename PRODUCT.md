# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static site: **Vite + React** in [`web/`](web/) → `dist/index.html` for GitHub Pages (Actions → `dist/`). Content compile: [`content/blocks/`](content/blocks/) → `web/public/site.json` via Node [`scripts/content/compile-site.mjs`](scripts/content/compile-site.mjs) (`npm run compile:content`). Longread chapters live in `content/blocks/article/chapters/*.json`; optional regen from `ARTICLE.md` with `scripts/migrate-article-to-json.mjs`. Editorial images live under [`assets/images/`](assets/images/) by block; public paths stay `images/…` via repo-root `images/` compat symlinks (`npm run sync:images`). Global CSS remains in [`assets/`](assets/) (Make parity, manifesto overrides). Scroll-stage and modals: TypeScript in [`web/src/interactivity/`](web/src/interactivity/). Local dev: `npm run compile:content` then `npm run dev` (repo root). Preview production: `npm run preview`.

## Users

**Primary:** Family “keepers” and owners evaluating Carelink — people who coordinate health data, contacts, and rituals for relatives across cities and generations. They arrive via GitHub Pages, shares, or internal review; they need to understand the product vision, trust model, and roadmap without a sales deck.

**Secondary:** Project author and collaborators (Slava Yakimov and contributors) who edit copy, landing structure, and visual polish before publish.

**Situation:** Reading a long-form manifesto and interactive landing (agenda bundles, chapters, values, skills) on desktop or mobile; optionally continuing into the full article.

## Product Purpose

Carelink Manifest is the **editorial product surface** for Carelink: a living longread (“A thousand astronauts at one table”) that explains why families fragment digitally and how Carelink proposes a family OS (Workspace, keepers, 152‑ФЗ data handling, web + mobile notifications). Success means readers grasp the narrative, distinguish **confirmed product facts** from **`Концепт`**, and can navigate the landing without layout or accessibility failures.

## Positioning

Unlike a feature list or pitch deck, this repo is a **journalistic investigation** wired to real source discipline: scenarios are fictional and labeled; metrics and feature names come from project sources or are marked concept. The landing adds Figma Make–aligned scroll experiences (agenda, chapters) on top of the article generator.

## Operating Context

- **Edit loop:** Change JSON in `content/blocks/` (or `ARTICLE.md` + migrate script), then `npm run build`. Commit `web/public/site.json` when content changed (or rely on CI compile). UI/React: `web/src/`.
- **Deploy:** GitHub Actions workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) publishes `dist/` (enable Pages → source: GitHub Actions). `.nojekyll` in `web/public/`.
- **Design iteration:** Neo Mirai / impeccable polish passes on CSS and JS; reference screenshots under `reference/polish-shots/`.
- **QA:** `node scripts/parity-gate.mjs` after compile; `node tools/audit-live-ui.mjs` against `npm run preview` URL (default port 4173).
- **Live browser:** Impeccable live mode — point at Vite dev URL or `dist/index.html` after build; re-run `npm run compile:content` after content block changes.

## Capabilities and Constraints

- Landing sections: hero, truth layer, agenda (9 challenge–scenario–solution bundles), chapters, values, skills, longread body, finale block from `ARTICLE.md` markers.
- Typography policy (project): Playfair Display headings, Echo 2 / Cosmetics MS labels, Inter body (`assets/fonts-slava.css`).
- Palette anchors: green `#1f5c4a`, bronze `#8a6a3b`, cream `#f7faf8` / `#f6efe4`, ink `#14201b`, mint `#dcefe6`.
- **Do not delete** landing content for parity with Figma Make reference; polish via CSS/JS, not removal.
- **Do not invent** testimonials, customer logos, measured outcomes, pricing, or legal claims not in sources.
- **`Концепт`** badge remains for unverified ideas in copy.
- Separate **Carelink product** (Workspace, apps) from **CosmoFusion DAO** metaphor — background only, not shipped v1 features.

## Brand Commitments

- **Voice:** Calm, editorial Russian prose; honest about fiction vs fact; “strong family vs digital cage” tension stays explicit.
- **Name:** Carelink; tagline context “Спокойная забота” in site chrome.
- **Visual:** Warm editorial print-meets-web (Neo Mirai direction on landing); owl mark in header (`assets/carelink-owl-*`).
- **Anti-hype:** No generic AI-SaaS purple gradients or productivity clichés on this surface.

## Evidence on Hand

- `README.md` — structure, build, publish, text rules.
- `ARTICLE.md` — full manifesto source and “how to read” conventions.
- `content/blocks/*.json`, `scripts/content/compile-site.mjs` — site payload and Node compile.
- `assets/figma-make-parity.css`, `reference/figma-make/` — Make ribbon reference.
- `reference/polish-shots/` — audit screenshots (390 / 768 / 1440).
- **Absent (must not fabricate):** customer case studies with real names, NPS or conversion benchmarks, production SLA claims, pricing.

## Product Principles

1. **Source honesty.** Facts and feature names trace to documented sources; everything else stays `Концепт` or fictional scenario.
2. **Show the system.** Landing scroll sections demonstrate narrative structure; longread delivers depth.
3. **Editorial craft.** Typography, spacing, and motion serve reading and orientation — not decoration for its own sake.
4. **Preserve parity.** Figma Make layout behaviors remain recognizable while Neo Mirai polish improves hierarchy and a11y.
5. **Ship static.** Keep the page fast and deployable without a JS framework build step.

## Accessibility & Inclusion

Target **WCAG 2.1 AA** on the public page: contrast on green/bronze/cream, keyboard focus on interactive controls (bundle/chapter nav, dialogs, skip link), `prefers-reduced-motion` respected in CSS/JS, semantic landmarks and labels on scroll regions. Russian primary language; readable sans for body, clear heading hierarchy.
