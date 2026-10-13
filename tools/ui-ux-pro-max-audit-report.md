# ui-ux-pro-max — аудит манифеста (Neo Mirai)

**База:** `gh-pages` @ `513bc3d` (после merge PR #4).  
**Ветка:** `cursor/ui-ux-pro-max-audit-2ff9` → PR в `gh-pages` (без merge).

Скриншоты: `/opt/cursor/artifacts/ui-ux-audit-before|after/` — `vyzovy`, `resheniya`, `glavy`, `final-value` × **390** / **1440** px.

Палитра (#1f5c4a / #8a6a3b / cream), сова-SVG и весь контент **сохранены**.

## Findings → fix

| # | Категория | Finding | Fix |
|---|-----------|---------|-----|
| 1 | A11y | Skip-link вёл в `#glava-1`, минуя `<main id="top">` | `href="#top"`, текст «К основному содержимому» (`build.py`) |
| 2 | A11y / motion | `.landing-finale-lead`, `.solutions-lead` без reveal → «пустой» блок при JS | Добавлены в цепочку `section-panel` |
| 3 | Responsive | Риск горизонтального overflow в финале | `overflow-x: clip` на `.landing-finale` |
| 4 | Focus | Фокус image-btn только на pill «Прочитать» | `:focus-visible` на всей кнопке + `appearance: none` |
| 5 | Touch | Hover lift на `.challenge-item` / `.solution-item` / `.product-arch` без fine pointer | Hover только `@media (hover:hover)` |
| 6 | Neo Mirai | Архитектура: radius 16px «SaaS» | `border-radius: 4px`, hairline border |
| 7 | Typography | Intro dev/arch: 62ch, слабый line-height | `--measure`, `line-height: 1.6` |
| 8 | Typography | Footnote финала узкая мера | `max-width: var(--measure)` |
| 9 | Neo Mirai | Label финала vs секции | `.landing-finale .section-label { letter-spacing: .14em }` |
| 10 | Reduced motion | Lead финала/решений оставались скрыты при `prefers-reduced-motion` | Добавлены в force-visible список |
| 11 | Interaction | `preventDefault` на `<button>` карточек | Только для `<a>` в `landing-cards.js` |
| 12 | — | Контраст `--mut`, touch 44px nav/tabs, `aria-modal`, backdrop 58%, image `aria-label`/`alt` | Уже на `513bc3d` — без регрессии |

390px: `scrollWidth === clientWidth` (нет горизонтального скролла) до и после.

Повтор съёмки: `node tools/capture-ui-audit.mjs /workspace /opt/cursor/artifacts/ui-ux-audit-after`
