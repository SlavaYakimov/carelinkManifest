# Манифест Carelink: живой лонгрид

«Тысяча астронавтов за одним столом» — манифест Carelink в жанре журналистского расследования. Это не список функций, а история: одинокие астронавты, затем стекло шлема с искажениями, затем коллективный разум, затем семья как государство в государстве, затем повседневная механика и в конце цифровое наследие.

## Структура

| Путь | Что это |
|---|---|
| `web/` | Vite + React → `dist/` для GitHub Pages |
| `content/blocks/` | Редакционный JSON: лендинг, лонгрид (`article/chapters/01.json`…), `landing-cards.json`, `chapter-images.json` |
| `scripts/content/` | Сборка `content/blocks` → `web/public/site.json` (Node) |
| `assets/style.css` | Стили. Палитра: тёмно-зелёный `#1f5c4a`, бронза `#8a6a3b`, кремовый `#f7faf8`, чернила `#14201b`, мятный `#dcefe6` |
| `assets/carelink-owl-avatar.svg` | Аватар-сова с книгой (SVGO), для маски и `<img>` |
| `assets/carelink-owl-128.png` | Favicon / apple-touch-icon и марка в шапке |
| `fonts/` | Локальные шрифты: Inter 400/500, Manrope 600/700 |
| `assets/images/` | Канон иллюстраций по блокам. Публичный URL по-прежнему `images/…` |
| `images/` | Compat-слой (симлинки на `assets/images/`). После клона: `npm run sync:images` |
| `issues.json` | По одной задаче на каждый раздел статьи: `{title, body, labels}` |
| `memory-context.md` | Контекст для CarelinkMemory |
| `shots/` | Скриншоты страницы (Playwright, ширина 1280 и 390) |
| `.nojekyll` | Отдаёт файлы как есть, без обработки Jekyll |

## Как обновлять

```bash
npm run sync:images          # после clone или правок assets/images/
# правим JSON в content/blocks/ (лонгрид — content/blocks/article/)
npm run build                # sync + compile:content + Vite → dist/
```

Опционально: импорт из внешнего `ARTICLE.md` в JSON — `node scripts/migrate-article-to-json.mjs` (файл в репозиторий не входит).

В лонгриде в JSON: блоки `paragraph`, `quote`, `list`, `reader_question`, `scenario`, `` `Концепт` `` в тексте → бейдж при сборке HTML.

## Публикация на GitHub Pages

Сборка в CI: `npm run build`, артефакт `dist/`. Settings → Pages → GitHub Actions.

## Правила текста

См. вступление в `content/blocks/article/intro.json` и блок «Об источниках» в `content/blocks/article/sources.json`.
