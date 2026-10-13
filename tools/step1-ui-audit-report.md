# Step 1 — ui-ux-pro-max (аудит + фиксы)

База: `site/cards-expand` после PR #4 (карточки «картинка + Прочитать»).

Скриншоты step1: `/opt/cursor/artifacts/step1-ui-audit-before|after/` (`vyzovy`, `resheniya`, `glavy`, `final-value` × 390/1440).  
PR #4 до/после: `/opt/cursor/artifacts/pr4/` — см. `tools/pr4-screenshots-report.md`.

## Замечание → что сделано

| # | Замечание | Что сделано |
|---|-----------|-------------|
| 1 | Контраст `--mut` на cream < 4.5:1 | Уже `#3d4843` |
| 2 | Touch targets nav/tabs/close < 44px | Уже min-height 44px |
| 3 | Фокус карточек landing | `:focus-visible` на `button.chapter-grid-card--image-btn` + pill «Прочитать» |
| 4 | Модалки `aria-modal`, возврат фокуса | Уже в разметке + `landing-cards.js` / `chapters.js` |
| 5 | Backdrop слабый | Уже ~58% scrim |
| 6 | Hover-only на touch | Hover под `@media (hover:hover)` |
| 7 | Lead финала без reveal | `.landing-finale-lead` в цепочке `section-panel` |
| 8 | Overflow секции финала | `overflow-x: clip` на `.landing-finale` |
| 9 | Кнопки-карточки: native appearance | `appearance: none` на `button.chapter-grid-card` |
| 10 | A11y заголовков без визуала | `aria-label` + `alt` на image-btn (PR #4) |

390px: горизонтальный скролл **нет** (проверка при съёмке). Контент и сова-SVG не удалялись.
