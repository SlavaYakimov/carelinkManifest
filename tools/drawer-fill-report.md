# Landing drawer sections fill (PR)

## Sources

- **Манифест:** `ARTICLE.md`, `chapters/*/v1.md`, `tools/chapter-blocks.json` (структурные блоки глав).
- **Карточки:** `tools/challenges.json`, `tools/finale_ctas.json` (без новых фактов — только перекладка и сжатие).
- **CarelinkMemory:** репозиторий `SlavaYakimov/CarelinkMemory` из этой среды **недоступен** (404). Тексты, помеченные в манифесте как выгрузки памяти / белая книга / блокноты, использованы **только там, где они уже процитированы** в `ARTICLE.md` и `chapter-blocks.json` (см. «Об источниках» в манифесте: `product/concepts/01–16`, «Миссия и философия…», CosmoFusion, навык blind-spots и т.д.).

## Implementation

- `tools/drawer_enrich.py` — дополняет шесть секций drawer (`hypothesis`, `challenges`, `problems`, `solutions`, `mission`, `values`) для `problem-*`, `scenario-*`, `solution-featured-*`, `finale-cta-*`, `landing-finale-1`.
- `tools/build.py` — вызывает `merge_sections()`; сценарии: «Узнаёте себя» → секция «В чём боль»; после сборки пишется `tools/landing-drawer-gaps.json`.

## Remaining gaps (empty sections)

После сборки: **0** — см. `tools/landing-drawer-gaps.json` (`count: 0`).

Секции, где в источниках только **Концепт** или открытый вопрос, всё равно заполнены **формулировками из манифеста** с пометкой `Концепт` / «требует подтверждения», без выдуманных механик.
