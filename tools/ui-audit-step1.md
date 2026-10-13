# UI audit — Step 1 (ui-ux-pro-max)

## Findings

| Area | Issue | Severity |
|------|--------|----------|
| Contrast | `--mut` (#4a5650) on `#f7faf8` ~4.2:1 for small text | High |
| Touch targets | Top nav links ~22px tall; tabs/close 40px | Critical |
| Focus | `.chapter-grid-card:focus-visible { outline: none }` | Critical |
| Modals | No `aria-modal`; focus not restored on close | High |
| Backdrop | 42% scrim — foreground legibility borderline | Medium |
| Responsive | 320px safe-area / tight header | Medium |
| Interaction | Hover-only card feedback on touch | Medium |

## Fixes (Step 1 commit)

- Darkened `--mut` to `#3d4843` (≥4.5:1 body secondary on cream).
- Nav, tabs, close, btn-nav: min 44×44px; safe-area padding on header/sections.
- Card focus ring restored; hover gated `@media (hover:hover)`; `:active` tap feedback.
- Dialogs: `aria-modal="true"`; focus return after close (chapters + landing cards).
- Backdrop 58%; skip-link visible focus styling.
