# Technical audit — agenda post-polish

**Surface:** `#agenda` / bundle scroll (landing)  
**Date:** 2026-10-14  
**Commands (2026-10-14):** `node tools/audit-live-ui.mjs`, `impeccable detect index.html assets/impeccable-polish.css` — **устарело:** каталог `tools/` удалён; актуально: `npm run build`, `node scripts/parity-gate.mjs`, ручной просмотр через `npm run preview`.

## Audit health score

| # | Dimension | Score | Key finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 3 | Agenda P1 contrast + 11px UI labels addressed in `impeccable-polish.css`; hero nav chips and longread still have sub-11px / decorative low-contrast pairs (Make parity). |
| 2 | Performance | 3 | Static assets, no bundler; horizontal scroll regions use `overscroll-behavior`. |
| 3 | Theming | 2 | `--bronze-ink`, `--title-on-wash`, `--ui-label-min` added; longread + Make layer still hard-code radii/colors vs DESIGN.md. |
| 4 | Responsive | 3 | `audit-live-ui.mjs` clean at 390 / 768 / 1440; touch targets ≥44px on bundle/chapter controls. |
| 5 | Implementation integrity | 2 | Coherent Neo Mirai + Family Gazette; detector flags side-tab borders (Make/longread) and design-system drift. |
| **Total** | | **13/20** | **Acceptable** — agenda shipping bar met; site-wide token pass optional. |

## Fixes applied (this pass)

- Functional labels in agenda panel ≥ **11px** (`--ui-label-min`).
- **AA text on warm wash:** `--bronze-ink` (#7a5e34) on `#f6efe4` / panel cream; scoped `--bronze` alias on warm sections + panel.
- **Bundle card titles on bronze ribbon:** `--title-on-wash` (#163f33) on mini `h3`; kickers use `--ink` on `#d9b98a`.

## Open (document only)

- Hero eyebrow **9.92px**; top nav section links **9px** — raise in a dedicated `/impeccable adapt` or nav polish pass.
- Decorative text on bundle **photos** (mint/bronze on image overlays) — not body copy; treat as art direction or add scrim.
- **Side-tab** `border-left` 4–6px on cards/callouts — inherited Make + longread pattern; changing risks parity.
- **Em-dash density** and **codex grid** on `body` — advisory.

## Verification

- `audit-live-ui.mjs` (local): `[]`
- Detector: no remaining **4.4:1** bronze-on-`#f6efe4` on agenda panel selectors after scoped token override; residual **8a6a3b** samples may be hero or non-agenda regions.
