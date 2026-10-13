"""Fill landing-card drawer sections from manifest text only (ARTICLE, chapter-blocks, challenges)."""
from __future__ import annotations

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent

# ARTICLE.md intro — block «уже сейчас» (lines 11–12 area)
MISSION_NOW = (
    'Владелец создаёт семью и приглашает родных по email, они входят через **Workspace**. '
    'Хранители ведут общие данные: здоровье, контакты, телефоны. Данные о здоровье и телефоны '
    'хранятся по **152‑ФЗ**. Уведомления приходят в веб (**CarelinkWeb** на Next.js, '
    'авторизация **CarelinkAuth** на Go) и в мобильном приложении на React Native.'
)

VALUES_MANIFESTO = (
    '«Вместо конфликта — диалог, вместо одиночества — участие, вместо лайков — забота» '
    '(документ «Миссия и философия экосистемы CareLink»). '
    'Во вступлении: «мы сами создаём свою семейную жизнь»; Carelink «не про контроль и не про '
    'список функций» — «секретарь, а не судья» (гл. 14).'
)

CHALLENGE_FAMILY_CELL = (
    'Во вступлении манифеста звучит честный вопрос: **крепкая семья или новая цифровая клетка?** '
    'Проект предупреждает о риске превратить заботу в контроль (гл. 9 — «закрытая секта»).'
)

ATOMIZATION_SYMPTOMS = (
    'В материалах CosmoFusion на семью переносят три «симптома» одиночества: **централизация** '
    '(решения узкого круга), **непрозрачность** («чёрный ящик») и **беспамятность** — '
    '«один и тот же спор в сотый раз, как в первый» (гл. 1).'
)

PROBLEM_CHAPTER = {
    1: 1,
    2: 2,
    3: 13,
    4: 4,
    5: 13,
    6: 14,
    7: 13,
    8: 2,
    9: 9,
}

SCENARIO_ENRICH: dict[str, dict[str, str]] = {
    'scenario-1': {
        'solutions': (
            'Манифест отвечает инфраструктурой и приглашением родных через **Workspace**, '
            'а не нравоучениями: «вместо одиночества — участие» (гл. 1). Вход «**через разговор**» '
            'и чат-бот как главный экран — **Концепт** (гл. 5).'
        ),
        'mission': MISSION_NOW,
        'values': VALUES_MANIFESTO,
        'challenges': (
            'Риск подменить разговор перепиской и ещё одним экраном — та же атомизация «рядом, но врозь», '
            'с которой начинается манифест.'
        ),
    },
    'scenario-2': {
        'solutions': (
            '**Дневник эмоций** и согласия описаны в гл. 6 как личный черновик; общая картина для семьи — '
            'через **Workspace** и данные по **152‑ФЗ** (вступление). Состав v1 — **Концепт**, где не подтверждено.'
        ),
        'mission': MISSION_NOW,
        'values': '«Мы не судим» — интонация платформы (гл. 14); подростку не нужен вердикт, а нужна граница приватности.',
        'challenges': (
            'Без согласий и прозрачности «общее место» превращается в слежку — в гл. 20 открыты вопросы по '
            '152‑ФЗ для Пульса и дневника.'
        ),
    },
    'scenario-3': {
        'solutions': (
            '**Бортовой журнал** и **Семейная Конституция** с версиями (гл. 3–4) — ответ на «беспамятность»; '
            '«кто забирает ребёнка» и бюджет фиксируются как договорённость, а не память одного человека.'
        ),
        'mission': MISSION_NOW,
        'values': '«Правила выше личностей» (гл. 4) — спор идёт о тексте правила, а не о том, кто громче.',
        'challenges': CHALLENGE_FAMILY_CELL,
    },
    'scenario-4': {
        'solutions': (
            '**Семейная Конституция**: ратификация, право голоса с 12 лет, **новая версия на каждую поправку** '
            '(гл. 4). Сценарий «статья 3» — из материалов проекта как узнаваемая механика (**Концепт** для v1).'
        ),
        'mission': MISSION_NOW,
        'values': VALUES_MANIFESTO,
        'challenges': (
            'Конституция без добровольности и без **Safety Override** может стать давлением большинства (гл. 9).'
        ),
    },
    'scenario-5': {
        'solutions': (
            '**Пятничный Пульс**: одни и те же вопросы, ответы закрыты, пока не ответят оба — '
            'увидеть расхождения без подстройки (гл. 7, **Концепт** как ритуал v1).'
        ),
        'mission': (
            'Еженедельный ритм в тексте описан как якорь; подтверждённый контур «уже сейчас» — '
            'семья, Workspace и уведомления (вступление).'
        ),
        'values': '«AI замечает паттерны. Решает семья» (гл. 10) — Пульс как зеркало, не отчёт начальнику.',
        'challenges': (
            'Family XP и стрики (гл. 18) могут превратить пятницу в экзамен — в материалах это **Концепт**, '
            'открытый вопрос к автору.'
        ),
    },
}

SOLUTION_ENRICH: dict[str, dict[str, str]] = {
    'solution-featured-1': {
        'hypothesis': (
            'CosmoFusion DAO назван исходной метафорой (звонок 13.10.2026); образы астронавтов — '
            '**фон для объяснения**, не часть продукта v1 (вступление).'
        ),
        'challenges': ATOMIZATION_SYMPTOMS,
        'mission': MISSION_NOW,
        'values': VALUES_MANIFESTO,
    },
    'solution-featured-2': {
        'hypothesis': (
            '**Пятничный Пульс**, семь шагов и «маяк, а не судья» — дорожная карта; '
            'главный чат-бот — **Концепт** (гл. 5, 7, 14).'
        ),
        'challenges': (
            'Семь искажений визора и подсветка AI — **Концепт** (гл. 2); риск, что помощник начнёт '
            '«оценивать» людей, если уйти от интонации секретаря (гл. 14).'
        ),
        'mission': MISSION_NOW,
        'values': '«Стекло шлема отражает ожидания, а не мир» (гл. 2) — диалог вместо приговора.',
    },
    'solution-featured-3': {
        'hypothesis': (
            'Общий календарь и **неизменяемые логи** для финансов/календаря названы в манифесте; '
            'входят ли финансы в v1 — **открытый вопрос к автору** (гл. 8).'
        ),
        'challenges': (
            '152‑ФЗ и нелицензированный P2P-банкинг — риски, которые проект называет сам (гл. 8).'
        ),
        'mission': MISSION_NOW,
        'values': '«Мы продаём инфраструктуру для счастья, а не банкинг» — формулировка из продуктового контекста (гл. 8).',
    },
}

FINALE_LEGACY_ENRICH = {
    'landing-finale-1': {
        'hypothesis': (
            'Всё, что не найдено в источниках, помечено **Концепт**; идеи из банка CarelinkMemory и CosmoFusion — '
            'дорожная карта (вступление, раздел «Об источниках»).'
        ),
        'challenges': CHALLENGE_FAMILY_CELL,
        'mission': MISSION_NOW,
        'problems': (
            'Финал начинается с человека: «слова и внутреннее состояние» выбирают поток вместо суеты — '
            'боль «рядом, но врозь» из вступления и первой главы.'
        ),
    },
}

FINALE_CTA_ENRICH: dict[str, dict[str, str]] = {
    'finale-cta-1': {
        'problems': (
            'Риск подменить тишину новой суетой — «ещё один экран вместо минуты с собой» '
            '(текст карточки; гл. 6 про минуту «до»).'
        ),
        'solutions': (
            '**Дневник эмоций** — личный черновик; **AI-инспектор** предлагает «остыть» перед разговором '
            '(гл. 6, **Концепт** для части механик v1).'
        ),
        'hypothesis': (
            'Утренние чекапы и «одна эмоция, одно спасибо» — **Концепт**; в v1 подтверждён только '
            '**Пятничный Пульс** (гл. 7).'
        ),
        'challenges': (
            'Carelink не обещает «исправить настроение» — только протокол: записать, выдохнуть, потом говорить (гл. 14).'
        ),
    },
    'finale-cta-2': {
        'problems': (
            '«Легко мне» без «легко нам» превращает заботу в сделку — риск токенов за вклад (гл. 3).'
        ),
        'solutions': (
            '**Семейная Конституция**, **бортовой журнал**, **AI-медиатор** с «я-фразами» — дорожная карта; '
            'состав v1 — **Концепт** (текст карточки).'
        ),
        'hypothesis': (
            'Carelink как «инструмент создавать свою реальность» — формулировка финального блока манифеста, '
            'не список кнопок v1.'
        ),
    },
    'finale-cta-3': {
        'problems': (
            'Спрятаться за «я ещё не готов» и не вернуться в разговор — риск, названный в тексте карточки (гл. 9).'
        ),
        'values': (
            'Медиатор: «я робот, а не психолог» — секретарь, не судья (гл. 14).'
        ),
        'hypothesis': (
            'Офлайн **Qwen на телефоне** — цель дорожной карты (гл. 19), **Концепт** для v1.'
        ),
    },
    'finale-cta-4': {
        'problems': (
            'Близкие в своих потоках — «планеты расходятся»; боль атомизации из гл. 1 и финала.'
        ),
        'mission': (
            'Подтверждённый контур: семья, **Workspace**, уведомления; **Пятничный Пульс** — **Концепт** как ритуал v1 (гл. 7).'
        ),
        'solutions': (
            '**Бортовой журнал** против беспамятности (гл. 3, 17); вход «**через разговор**» (гл. 5, **Концепт**).'
        ),
    },
    'finale-cta-5': {
        'problems': (
            'Риск «закрытой секты» — правила семьи не могут отключить предохранитель (гл. 9).'
        ),
        'solutions': (
            '**Семейная Конституция**, **Safety Override**, **CarelinkAuth**, **Data Emancipation** в 18 лет — '
            'как в тексте карточки и гл. 4, 9, 13.'
        ),
        'hypothesis': (
            'Часть механик аудита и приглашений — **Концепт** для v1 (гл. 13, 20).'
        ),
    },
}


def _block(ch: int, field: str, blocks: dict) -> str:
    return (blocks.get(str(ch), {}).get(field) or '').strip()


def enrich_problem(i: int, blocks: dict) -> dict[str, str]:
    ch = PROBLEM_CHAPTER.get(i, 1)
    b = blocks.get(str(ch), {})
    out: dict[str, str] = {}
    hyp = _block(ch, 'hypothesis', blocks)
    if hyp:
        out['hypothesis'] = hyp
    elif i == 1:
        out['hypothesis'] = (
            'Образы **CosmoFusion DAO** — фон для объяснения, не часть продукта v1; '
            'сайт назван исходной метафорой на звонке 13.10.2026 (вступление, гл. 1).'
        )
    elif i == 7:
        out['hypothesis'] = _block(13, 'hypothesis', blocks) or _block(20, 'hypothesis', blocks)
    risks = _block(ch, 'risks', blocks)
    if risks:
        out['challenges'] = risks
    elif i == 1:
        out['challenges'] = ATOMIZATION_SYMPTOMS
    elif i == 2:
        out['challenges'] = (
            'Список **семи искажений визора** — **Концепт** (гл. 2): якорь, «эхо-камера», '
            'групповое мышление, давление авторитета и другие — каждое усиливает «стены» между близкими.'
        )
    elif i == 4:
        out['challenges'] = (
            'Без версий и подписей правила живут «в воздухе» — в материалах это связано с риском '
            '**газлайтинга** («мы же договорились», но текста нет).'
        )
    elif i == 7:
        out['challenges'] = _block(20, 'risks', blocks) or (
            'Пульс и дневник — особые категории данных по **152‑ФЗ**; соответствие в материалах '
            'не подтверждено (гл. 20).'
        )
    elif i in (3, 5):
        out['challenges'] = (
            _block(19, 'risks', blocks) or _block(20, 'risks', blocks) or CHALLENGE_FAMILY_CELL
        )
    elif i == 9:
        out['challenges'] = _block(9, 'risks', blocks)
    elif i == 8:
        out['challenges'] = (
            'Седьмое **искажение визора** — давление авторитета — из списка гл. 2 (**Концепт**).'
        )
    quote = (b.get('quote') or '').strip()
    if quote:
        out['values'] = f'В материалах проекта: {quote}'
    else:
        out['values'] = VALUES_MANIFESTO
    out['mission'] = MISSION_NOW
    return out


def merge_sections(card_id: str, sections: dict | None, blocks: dict) -> dict:
    merged = dict(sections or {})
    patch: dict[str, str] = {}

    m = re.match(r'problem-(\d+)$', card_id)
    if m:
        patch = enrich_problem(int(m.group(1)), blocks)
    elif card_id in SCENARIO_ENRICH:
        patch = dict(SCENARIO_ENRICH[card_id])
        if card_id == 'scenario-1' and not (merged.get('hypothesis') or '').strip():
            h5 = _block(5, 'hypothesis', blocks)
            if h5:
                patch['hypothesis'] = h5
        if card_id == 'scenario-3' and not (merged.get('hypothesis') or '').strip():
            h17 = _block(17, 'hypothesis', blocks)
            if h17:
                patch['hypothesis'] = h17
    elif card_id in SOLUTION_ENRICH:
        patch = SOLUTION_ENRICH[card_id]
    elif card_id in FINALE_LEGACY_ENRICH:
        patch = FINALE_LEGACY_ENRICH[card_id]
    elif card_id in FINALE_CTA_ENRICH:
        patch = FINALE_CTA_ENRICH[card_id]

    for key, text in patch.items():
        if text and not (merged.get(key) or '').strip():
            merged[key] = text
    return merged


def write_gaps_report(gaps: list[tuple[str, str]], labels: dict[str, str], path: pathlib.Path) -> None:
    rows = [
        {'card_id': cid, 'section': sec, 'label': labels.get(sec, sec)}
        for cid, sec in gaps
    ]
    path.write_text(
        json.dumps({'remaining_gaps': rows, 'count': len(rows)}, ensure_ascii=False, indent=2),
        encoding='utf-8',
    )
