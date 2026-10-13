# PR #4 — скриншоты до / после

**До:** `origin/gh-pages` (worktree `bfcaf11`, после `python3 tools/build.py`).  
**После:** `site/cards-expand` (tip ветки, после `python3 tools/build.py`).  
**Viewport:** 390×900 и 1440×900. Секции с `section-panel.is-visible` для стабильного кадра.

Каталог: `/opt/cursor/artifacts/pr4/`

## До (`before/`)

| Файл | Секция |
|------|--------|
| `vyzovy-390px.png` | Вызовы (`#vyzovy`) |
| `vyzovy-1440px.png` | Вызовы |
| `resheniya-390px.png` | Решения (`#resheniya`) |
| `resheniya-1440px.png` | Решения |
| `glavy-390px.png` | Главы (`#glavy`) |
| `glavy-1440px.png` | Главы |
| `final-value-390px.png` | Финальная ценность (`#final-value`) |
| `final-value-1440px.png` | Финальная ценность |

## После (`after/`)

| Файл | Секция |
|------|--------|
| `vyzovy-390px.png` | Вызовы |
| `vyzovy-1440px.png` | Вызовы |
| `resheniya-390px.png` | Решения |
| `resheniya-1440px.png` | Решения |
| `glavy-390px.png` | Главы |
| `glavy-1440px.png` | Главы |
| `final-value-390px.png` | Финальная ценность |
| `final-value-1440px.png` | Финальная ценность |
| `modal-landing-390px.png` | Модалка карточки (проблема 1, `#landing-card-dialog`) |
| `modal-landing-1440px.png` | Модалка карточки |

Повторная съёмка: `node tools/capture-pr4.mjs <repo-root> /opt/cursor/artifacts/pr4/before` и с `--modal` для `after/`.
