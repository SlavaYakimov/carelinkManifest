---
target: web/src/components/landing/ManifestHero.tsx
total_score: 18
max_score: 32
na_heuristics: 7,9,10
p0_count: 0
p1_count: 2
p2_count: 2
target_identity: "file:/Users/jsnanodegree/Desktop/CarelinkManifest/carelinkManifest/web/src/components/landing/ManifestHero.tsx"
target_fingerprint: "sha256:2fe88fbdb3ef3444632d289c1aedc345ac2c362e1997d75570af00d2c8335634"
target_path: /Users/jsnanodegree/Desktop/CarelinkManifest/carelinkManifest/web/src/components/landing/ManifestHero.tsx
timestamp: 2026-10-14T03-57-44Z
slug: web-src-components-landing-manifesthero-tsx
---
# Critique: ManifestHero (post-P1, user: «раньше было лучше»)

Method: dual-agent (A: 779d6be5-9d6e-4650-96de-5ade0f380d23 · B: 5364b923-7b6e-499a-b80a-cc4eed53737d)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Табы + aria-live на standfirst |
| 2 | Match System / Real World | 2 | «Семейная ОС» vs был таб «Данные в России» |
| 3 | User Control and Freedom | 3 | Табы, якорные CTA |
| 4 | Consistency and Standards | 2 | `kicker` в JSON не в UI; бренд только в header |
| 5 | Error Prevention | 3 | — |
| 6 | Recognition Rather Than Recall | 3 | Chips над standfirst в panel (лучше, чем снаружи) |
| 7 | Flexibility and Efficiency | n/a | Persuade |
| 8 | Aesthetic and Minimalist Design | 2 | Плотная panel, border-top, меньше воздуха у фото |
| 9 | Error Recovery | n/a | — |
| 10 | Help and Documentation | n/a | Truth ниже fold |
| **Total** | | **18/32** | **Acceptable** (~56%) |

## Design Specificity Verdict

**LLM:** Семейное фото, keeper-тон и 152‑ФЗ в lead остаются «своими». P1 сдвинул доверие с **сканируемого факта** (таб про Россию) на **слоган и абстрактные chips** — для RU keepers это ощущается как регресс, хотя UX-чеклист (grouping табов) улучшился.

**Detector:** Static `ManifestHero.tsx` — **0**. URL @390/1440 — **0** hero-scoped (`carelink-hero`, `#hero-tab-*`). Технически hero чист; «раньше лучше» — про смысл и композицию, не про lint.

## Overall Impression

Ощущение «раньше было лучше» **обосновано**: committed hero был **короче** (бренд/факт + chips снаружи), P1 — **редакционная колонка в коробке** с длинным h1 без «Carelink». Эвристики чуть выросли (18 vs 17), но **эмоциональный пик доверия на фолде** слабее — отсюда диссонанс.

## What's Working (оставить из P1)

1. Chips **над** standfirst в одной panel — связь «тема → абзац».
2. Сильный слоган и lead с 152‑ФЗ в одном экране.
3. Semantic styling, 11px floor, a11y на табах.

## Priority Issues

**[P1] Доверие на первом скане** — убран trustNote; первый таб «Семейная ОС» вместо «Данные семьи остаются в России».  
**Fix:** вернуть конкретный tab 0 + короткая строка доверия *между panel и CTA* (не дубль Truth layer).  
**Command:** `/impeccable clarify content/blocks/hero.json`

**[P1] Бренд на фолде** — «Carelink» только в header; h1 = общий слоган.  
**Fix:** lockup: `h1` = Carelink, слоган = lead (укоротить); или слоган в lead, `title` = «Carelink» (как committed).  
**Command:** `/impeccable typeset` + `/impeccable clarify hero.json`

**[P2] Фото и воздух** — плотный overlay + широкая panel.  
**Fix:** ослабить gradient; panel только на h1+lead; chips/standfirst без «второй коробки».  
**Command:** `/impeccable quieter ManifestHero.styles.ts` + `/impeccable layout`

**[P2] Плотность до CTA** — h1 + lead + chips + standfirst min-height + 2 CTA.  
**Fix:** укоротить standfirst default tab; убрать или снизить `min-height` standfirst.  
**Command:** `/impeccable distill ManifestHero.styles.ts`

**[P3] `kicker` в JSON** — не рендерится; craft-floor **запрещает eyebrow над h1** — не восстанавливать как kicker; masthead = бренд в h1 или подзаголовок в lead.

## Regression vs P1 (что откатить частично)

| Вернуть | Не откатывать |
|---------|----------------|
| Carelink на фолде | Chips внутри panel над standfirst |
| Tab 0 про Россию/152‑ФЗ | Контент из JSON, semantic tokens |
| Короткий trust у CTA или в tab | Полный откат к пустым styled wrappers |
| Больше фото | Длинный слоган *где-то* (lead, не обязательно весь h1) |

## Persona Red Flags

**Jordan:** не видит имени продукта в hero; жаргон ОС/Workspace.  
**Casey:** длинный путь до CTA на mobile (`flex-end` + panel).  
**Keeper:** нет «данные в РФ» на первом взгляде — только в lead.

## Questions to Consider

- Слоган в h1 стоил бренда и таба про Россию?
- Trust в hero снова — одна строка или только Truth layer?
- Panel — шапка или вся история?
