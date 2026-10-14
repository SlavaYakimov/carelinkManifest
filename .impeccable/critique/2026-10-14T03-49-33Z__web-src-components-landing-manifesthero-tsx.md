---
target: web/src/components/landing/ManifestHero.tsx
total_score: 17
max_score: 32
na_heuristics: 7,9,10
p0_count: 0
p1_count: 3
p2_count: 2
target_identity: "file:/Users/jsnanodegree/Desktop/CarelinkManifest/carelinkManifest/web/src/components/landing/ManifestHero.tsx"
target_fingerprint: "sha256:01d4e3a28949d52b68b3d1a67d9e6c434a0b74b5d6b53ea2af8c9a530b58cdb7"
target_path: /Users/jsnanodegree/Desktop/CarelinkManifest/carelinkManifest/web/src/components/landing/ManifestHero.tsx
timestamp: 2026-10-14T03-49-33Z
slug: web-src-components-landing-manifesthero-tsx
closed: true
---
# Critique: ManifestHero

Method: dual-agent (A: 59fa234f-c5d2-4f4c-9afe-eb8afdd9d0c6 · B: a7f9b082-d45e-4666-bdc1-c852995a431c)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | `aria-selected` + `aria-live` на standfirst; связь chip → абзац неочевидна |
| 2 | Match System / Real World | 2 | `keepers`, Workspace, «Семейная ОС» без контекста; `h1` = бренд, не обещание |
| 3 | User Control and Freedom | 3 | Табы + клавиатура (`initManifesto.ts`); якоря `#agenda`, `#glavy-manifest` валидны |
| 4 | Consistency and Standards | 2 | Chips снаружи panel, standfirst внутри; parity CSS vs styled-components |
| 5 | Error Prevention | 3 | Мало рисков; secondary ведёт на `#glavy-manifest` в `ChaptersScroll` |
| 6 | Recognition Rather Than Recall | 2 | Нужно догадаться, что chips меняют текст выше и в другом контейнере |
| 7 | Flexibility and Efficiency | n/a | Persuade-лендинг |
| 8 | Aesthetic and Minimalist Design | 2 | 7+ смысловых блоков до скролла (panel + chips + trust + 2 CTA) |
| 9 | Error Recovery | n/a | Нет форм/ошибок |
| 10 | Help and Documentation | n/a | Help = truth layer ниже fold |
| **Total** | | **17/32** | **Acceptable** (~53%) |

## Design Specificity Verdict

**LLM:** Частично авторский «Family Gazette» — `HeroPanel`, кремовый wash, честный `trustNote`, русский keeper-тон. Каркас split-hero + pill chips остаётся категорийным; без панели и copy легко спутать с wellness-SaaS. Специфичность в контенте и trust-surface, не в первой строке и композиции табов.

**Deterministic scan:** Static `detect` по `ManifestHero.tsx` / `.styles.ts` — **0** findings (ожидаемо без DOM). На рендере (localhost, hero в контексте страницы): **7** hero-scoped @ ~390px — `undersized-ui-text` на `#hero-tab-*` и `.carelink-hero__cta`; `tiny-text` + `wide-tracking` на `.carelink-hero__trust-note`; @ 1440px — trust-note **low-contrast 4.48:1** (порог 4.5:1). Инъекция `detect.js` через live-server: overlay **успешна** (см. сессию Assessment B).

**Согласование A+B:** Детектор подтверждает перегруз мелкой типографикой на узком viewport (chips/CTA) и пограничный контраст trust-note — то, что эвристика 8 и cognitive load уже ловят качественно.

## Overall Impression

Hero уже честный и тёплый — панель и фото работают на keeper’а. Главный разрыв Persuade: **обещание размазано** (сильный lead, слабый `h1`), а **интерактив табов ломает grouping**. Технически hero чист по static scan, но в браузере на мобиле типографика chips/CTA уходит ниже 11px — это P1 для `audit`/`adapt`.

## What's Working

1. **`HeroPanel` + градиент `HeroOverlay`** — редакционный «врез» на семейном кадре, не generic purple gradient.
2. **Честность copy** — `trustNote` и вкладка «Открытый манифест» совпадают с PRODUCT (anti-hype, Концепт).
3. **A11y на табах** — `tablist`/`tabpanel`, 44px targets, `focus-visible`, reduced-motion на press.

## Priority Issues

**[P1] Табы оторваны от standfirst**  
- **Why:** Пользователь не связывает chips с абзацем в панели; лишняя working memory.  
- **Fix:** Перенести `HeroChips` внутрь `HeroPanel` над standfirst или добавить явную подпись «Тема».  
- **Command:** `/impeccable layout web/src/components/landing/ManifestHero.tsx`

**[P1] Слабый Persuade-hook в `h1`**  
- **Why:** За 5 с неясно «зачем читать» — только логотип «Carelink»; эмоция уезжает в длинный lead.  
- **Fix:** Двухуровневый lockup (бренд + тезис из манифеста/meta) или сильная display-строка в контенте; укоротить lead.  
- **Command:** `/impeccable clarify content/blocks/hero.json` + `/impeccable typeset ManifestHero.styles.ts`

**[P1] Мелкий UI-текст на узком viewport (detector)**  
- **Why:** Табы и primary CTA &lt;11px computed — читаемость и WCAG AA на 390px.  
- **Fix:** Поднять floor в `HeroChips`/`HeroCta` clamp; проверить конфликт с `figma-make-parity.css`.  
- **Command:** `/impeccable audit web/src/components/landing/ManifestHero.styles.ts`

**[P2] Trust-note до primary CTA**  
- **Why:** Правильная честность, но режет Persuade-пик («сноска» перед действием); детектор: tiny + wide-tracking + 4.48:1 contrast.  
- **Fix:** Слегка крупнее/контрастнее note или перенос части дисклеймера к truth layer; оставить в hero одну короткую строку.  
- **Command:** `/impeccable distill ManifestHero.tsx` или `/impeccable quieter HeroTrustNote`

**[P2] Нет моста к `#manifest-truth`**  
- **Why:** Сильнейший блок доверия сразу под hero не связан с первым экраном.  
- **Fix:** Текстовая ссылка в `trustNote` или secondary tertiary link.  
- **Command:** `/impeccable clarify ManifestHero.tsx`

**[P3] Потерян editorial `kicker` из JSON**  
- **Why:** `kicker` в `hero.json` не рендерится (`trustNote` его не заменяет по смыслу — «Манифест · Для тех, кто рядом» vs дисклеймер).  
- **Fix:** Отдельная masthead-строка (label), не SaaS-eyebrow; не дублировать trust.  
- **Command:** `/impeccable layout` + `/impeccable clarify` (согласовать с craft floor: masthead ≠ декоративный kicker)

## Persona Red Flags

**Jordan (first-timer):** Не понимает за 5 с — продукт, манифест или статья. Chips как «фильтры», не как смена абзаца. Жаргон без глоссария в hero.

**Casey (mobile):** Плотный столбец (`flex-end` на ≤760px); до primary CTA — panel + chips + trust. Detector: мелкие табы/CTA на узкой ширине.

**Keeper (PRODUCT):** Lead попадает в боль «одна голова» — плюс. Trust до CTA может звучать как «не готово». Secondary с «Workspace» на англ. отсекает менее техничных.

## Minor Observations

- `initManifesto.ts` пишет `textContent` — ок для plain text, несовместимо с будущим HTML в standfirst.
- `HeroCta` uppercase pill — чуть SaaS на gazette-фоне; secondary текстовая — удачный контраст.
- Header `top-cta` 10px в detector — не ManifestHero, но виден в том же viewport.

## Questions to Consider

- Один standfirst без табов — смелее или пустее для keeper’а?
- Дисклеймер в hero или только в TruthLayer?
- Бренд в `h1` vs манифестная строка в первом экране?
