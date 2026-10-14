---
name: Carelink Manifest
description: Warm editorial longread and Figma Make–aligned landing for the Carelink family OS manifesto
colors:
  green: "#1f5c4a"
  green-deep: "#163f33"
  bronze: "#8a6a3b"
  cream: "#f7faf8"
  cream-warm: "#f6efe4"
  ink: "#14201b"
  mint: "#dcefe6"
  muted: "#3d4843"
  line: "#d3e2da"
  hairline-green: "rgba(31, 92, 74, 0.16)"
  wash-bronze: "#e9dcc7"
typography:
  display:
    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif"
    fontSize: "clamp(3rem, 7.2vw, 6.2rem)"
    fontWeight: 300
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(1.75rem, 2.8vw, 2.35rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(1rem, 1.08vw, 1.28rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Echo 2', Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(16px, 0.35vw + 15px, 18px)"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "'Cosmetics MS', Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0.12em"
rounded:
  mirai: "4px"
  card-soft: "14px"
  card-landing: "18px"
  pill: "999px"
  skip-focus: "8px"
spacing:
  section-y: "clamp(4.5rem, 10vw, 7.5rem)"
  section-x: "clamp(1.25rem, 5vw, 3.5rem)"
  measure: "62ch"
  header-h: "74px"
  bundle-viewport-pad: "clamp(1.15rem, 2.75vw, 2rem)"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "11px 20px"
  button-primary-hover:
    backgroundColor: "{colors.green-deep}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
  button-ghost-mint:
    backgroundColor: "rgba(220, 239, 230, 0.62)"
    textColor: "{colors.green-deep}"
    rounded: "{rounded.pill}"
    padding: "11px 20px"
  chip-filter:
    backgroundColor: "rgba(247, 250, 248, 0.82)"
    textColor: "{colors.green-deep}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
  nav-link:
    typography: label
    textColor: "{colors.muted}"
  card-ticket:
    backgroundColor: "{colors.cream}"
    rounded: "{rounded.mirai}"
    padding: "clamp(18px, 2.2vw, 24px)"
---

# Design System: Carelink Manifest

## Overview

**Creative North Star: "The Family Gazette"**

The surface reads like a calm Russian editorial publication layered with a scroll-driven “exhibition” landing (Figma Make parity). Paper warmth, forest green authority, and bronze accents carry the voice of Carelink without SaaS theatrics. Density is moderate: generous measure for reading, tighter grids for landing cards and sticky side panels. Neo Mirai polish (`assets/impeccable-polish.css`) refines hierarchy, mint selection states, and 4px structural radius on top of Make behavior—never replacing content or layout logic.

**Key Characteristics:**

- Playfair Display for display and section titles; Inter stands in until Echo 2 and Cosmetics MS files are confirmed (`assets/fonts-slava.css`).
- Green/bronze/cream palette with mint for selection and progress—not purple gradients or glassmorphism.
- 4px “Mirai” radius on polished controls; larger 14–18px radii on longread cards only where already established.
- Scroll-jacked agenda/chapters on desktop; horizontal snap on mobile (`max-width: 760px`).
- Photography with slight desaturation on landing minis; gradient washes into cream footers on bundle cards.

## Colors

Forest-and-paper palette: green carries brand and links; bronze marks meta, kickers, and progress; cream/mint backgrounds keep warmth without pure gray text on tinted fields.

### Primary

- **Keeper Green** (#1f5c4a): Headlines, primary CTAs, active wayfinding, inset selection rails on agenda/chapter nav.
- **Deep Keeper** (#163f33): Hover/pressed primary, emphasized card titles, chip text on cream.

### Secondary

- **Archive Bronze** (#8a6a3b): Kickers, section labels, progress bar, decorative rules, secondary emphasis in hero subtitle.

### Neutral

- **Reading Cream** (#f7faf8): Page background, header, card faces, dialog sheets.
- **Warm Section Wash** (#f6efe4): Agenda/chapters/values/skills section fills (Make + polish).
- **Ink Body** (#14201b): Primary text on light surfaces.
- **Muted Sage** (#3d4843): Secondary body, nav default state—never `#999` gray alone on colored panels.
- **Divider Mint** (#d3e2da): `--line` borders between chrome and sections.
- **Selection Mint** (#dcefe6): Selection highlight, mint pill backgrounds, active row tints (`rgba(220, 239, 230, 0.55)`).

### Named Rules

**The No Gray-on-Tint Rule.** Body copy on cream, mint, or bronze-tinted panels uses `--ink` or `--mut`, not neutral `#808080`. Bronze text is for labels and meta, not paragraphs.

**The Green-Rail Rule.** Active bundle/chapter rows use a mint wash plus inset 3px green left rail—not solid bronze slabs (`#d9b98a` is legacy Make; overrides live in `impeccable-polish.css`).

## Typography

**Display Font:** Playfair Display (self-hosted woff2, Cyrillic + Latin)

**Body Font:** Echo 2 with Inter fallback (Inter fully hosted)

**Label Font:** Cosmetics MS with Inter fallback (uppercase navigation, kickers, chain labels)

**Character:** Editorial serif authority for titles; restrained sans for reading and wayfinding. Uppercase labels are small, tracked, and never glued to titles—grid columns separate label from title on panel chains.

### Hierarchy

- **Display** (300, clamp hero sizes, ~0.96 line-height): Landing hero `h1`, large chapter openers.
- **Headline** (700, clamp 1.75–2.35rem, tight tracking): Section intros, panel headings (`Вызовы · Сценарии · Решения`).
- **Title** (600–700, card titles, bundle mini `h3`): Card grids, bundle/chapter card copy.
- **Body** (400, 16–18px, 1.7, max ~62ch): Longread, dialog bodies, glossary.
- **Label** (600, 10–12px, 0.08–0.14em tracking, uppercase): Nav, kickers, `ВЫЗОВ` / `СЦЕНАРИЙ` / `РЕШЕНИЕ` chain labels, mono meta.

### Named Rules

**The Playfair-Head Rule.** Anything using `var(--head)` or manifesto heading selectors stays Playfair 700 on landing panels and card titles—not Cormorant SC from Make parity (overridden in `manifesto.css` / `impeccable-polish.css`).

**The Measure Rule.** Prose blocks target `--measure` (62ch) for longread and intro copy; landing scroll regions may go full bleed horizontally but keep readable line length in panel text.

## Layout

- **Page grid:** `--page-max: 1440px`, `--content-max: 1120px`, horizontal padding `--section-x`.
- **Header:** Fixed `--header-h: 74px`; scroll padding accounts for header + 12px.
- **Landing stack:** `.carelink-page` wraps hero → truth layer → narrative intro → `#agenda` sticky scroll stage (viewport + right `.bundle-panel`) → chapters mirror → values/skills rows → generated longread.
- **Agenda/chapters desktop:** Sticky full-viewport stage; track translated via scroll (`manifesto.js`); side panel ol lists with chain buttons in two-column grid (`--bundle-chain-label`).
- **Mobile (≤760px):** Horizontal scroll on bundle/chapters viewports; arrows hidden; reduced label column width.
- **Longread:** Section panels with `[data-reveal]` entrance; ticket grids with horizontal bleed carousels where marked `--bleed`.

## Elevation & Depth

Hybrid: mostly flat cream surfaces with hairline borders; depth on hover via soft green-tinted shadows, not heavy drop shadows on every card.

### Shadow Vocabulary

- **Soft float** (`0 28px 90px rgba(20,32,27,.1)` — `--shadow-soft`): Hero CTAs, hovered challenge/solution cards.
- **Card lift** (`0 18px 48px -28px rgba(31,92,74,.28)` — `--shadow-card`): List cards at rest; intensifies on hover with slight translateY(-2px).
- **Control float** (`0 6px 18px rgba(20,32,27,.12)`): Bundle/chapter circular nav arrows on polished landing.

### Named Rules

**The Flat-Until-Hover Rule.** Sticky scroll cards and panel rows stay flat at rest; mint active state replaces bronze fill for orientation.

## Shapes

- **Mirai default:** 4px radius on chips, polished buttons, glossary, truth cards (`--mirai-radius`).
- **Longread cards:** 14–18px radius on challenge/solution/dev items (legacy editorial blocks).
- **Pills:** Full rounding on `.top-cta`, hero chips, read-more pills.
- **Borders:** 1px `--hairline` / `--mirai-hairline`; left accent bars 2–4px green or bronze for section emphasis in drawers.

## Components

### Buttons

- **Shape:** Pill (999px) for primary chrome; 4px on square icon buttons in polished bundle minis.
- **Primary:** Green fill, cream text, label font, 44px min touch target on nav and panel chains.
- **Ghost mint:** Semi-transparent mint fill, green border—card “read” affordances.
- **Hover / Focus:** Darker green or mint intensify; `outline: 3px solid rgba(31, 92, 74, 0.55)` focus ring (manifesto.css); no bounce easing.

### Chips

- **Style:** Cream background, green border/text, uppercase label font—hero topic tabs.
- **State:** `aria-selected` drives standfirst swap; active chip gets green underline/inset shadow in polish layer.

### Cards / Containers

- **Landing tickets:** Cream face, 4px radius, inset white highlight, optional 16:10 media with desaturated photo.
- **Bundle mini:** Image with bottom gradient wash to cream; copy block with kicker + Playfair title; circular → affordance top-right.
- **Drawers / dialogs:** Cream gradient sheet, Playfair title in green, bronze kicker; overlay `rgba(20,32,27,.58)`.

### Navigation

- **Top nav:** Label font, muted default, green underline slide on hover; mono class for meta labels.
- **Bundle/chapter panel:** Number column + chain grid; mint active row; keyboard focus matches hover mint wash.
- **Mobile:** Counters and range inputs in panel header; horizontal scroll on viewport.

### Signature: Scroll stage (Agenda / Chapters)

- **Behavior:** Window scroll drives `translate3d` on track (desktop) or `scrollLeft` (mobile); progress bar bronze on viewport bottom; prev/next fixed to viewport padding, not clipped at edge (`--bundle-viewport-pad`).

## Do's and Don'ts

### Do:

- **Do** use CSS variables from `:root` in `assets/style.css` for new surfaces (`--green`, `--head`, `--section-x`, etc.).
- **Do** layer overrides in order: `figma-make-parity.css` → `manifesto.css` → `impeccable-polish.css`.
- **Do** keep 44px minimum interactive targets on panel chains, arrows, and dialog close.
- **Do** respect `prefers-reduced-motion` (disable transform will-change and scroll-jack smoothing where already wired).

### Don't:

- **Don't** remove or collapse landing sections for “simplicity”—polish in place per PRODUCT.md.
- **Don't** reintroduce solid bronze `#d9b98a` panel active fills or Cormorant SC on chain labels.
- **Don't** use generic AI landing patterns (purple gradients, nested card stacks, Inter-only everything).
- **Don't** edit repeatable landing blocks only in `dist/`—change `content/blocks/` and React in `web/src/`, then `npm run compile:content` and `npm run build`.
