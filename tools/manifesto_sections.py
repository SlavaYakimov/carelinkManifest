"""Секции лендинга Figma Make — HTML для tools/build.py (parity ribbon-rake-92617748.figma.site)."""
import html
import json
import math
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

_KIND_LABEL = {'vyzov': 'Вызов', 'scenario': 'Сценарий', 'reshenie': 'Решение'}


def _load(name):
    return json.loads((ROOT / 'tools' / name).read_text(encoding='utf-8'))


def render_narrative_intro(
    h2,
    text,
    inline_fn,
    section_id='',
    *,
    extra_html='',
    skip_href='',
    skip_label='',
):
    sid = f' id="{section_id}"' if section_id else ''
    skip = ''
    if skip_href:
        label = skip_label or 'Пропустить интерактивное листание — перейти к ценностям'
        skip = (
            f'<p class="narrative-intro__skip">'
            f'<a href="{html.escape(skip_href, quote=True)}">'
            f'{html.escape(label)}</a></p>'
        )
    return (
        f'<section class="narrative-intro"{sid} data-reveal>'
        f'<h2>{html.escape(h2)}</h2>'
        f'<p>{inline_fn(text)}</p>'
        f'{extra_html}'
        f'{skip}'
        f'</section>'
    )


def render_truth_layer(inline_fn):
    data = _load('landing-editorial.json')['truth_layer']
    return (
        f'<section class="truth-layer" id="manifest-truth" data-reveal aria-labelledby="truth-layer-title">'
        f'<h2 id="truth-layer-title" class="truth-layer__title">{html.escape(data["heading"])}</h2>'
        f'<p class="truth-layer__body">{inline_fn(data["body"])}</p>'
        f'</section>'
    )


def render_glossary(inline_fn):
    items = _load('landing-editorial.json')['glossary']
    lis = []
    for row in items:
        lis.append(
            f'<li><dfn>{html.escape(row["term"])}</dfn> — {inline_fn(row["definition"])}</li>'
        )
    return (
        f'<aside class="landing-glossary" data-reveal aria-label="Короткий словарь">'
        f'<h3 class="landing-glossary__title">Пять слов, которые встретятся дальше</h3>'
        f'<ul class="landing-glossary__list">{"".join(lis)}</ul>'
        f'</aside>'
    )


def _detail_card_html(card_id, kicker, title, description, image, alt, inline_fn, img_picture_fn):
    body = (
        f'<figure class="detail-modal-hero">{img_picture_fn(image, alt, "detail-modal-img", None, "lazy")}</figure>'
        f'<p class="landing-card-modal-lead">{inline_fn(description)}</p>'
    )
    return {
        'id': card_id,
        'kicker': kicker,
        'title': title,
        'body': body,
    }


def _img_src(path):
    return html.escape(path or '')


def _bundle_mini(
    card_id,
    label,
    title,
    description,
    image,
    alt,
    inline_fn,
    img_picture_fn,
    detail_store,
    *,
    fiction_badge=False,
):
    detail = _detail_card_html(card_id, label, title, description, image, alt, inline_fn, img_picture_fn)
    detail_store.append(detail)
    fiction = (
        '<span class="bundle-mini__fiction">Вымышленный сценарий</span>'
        if fiction_badge
        else ''
    )
    return (
        f'<article class="bundle-mini">'
        f'<img src="{_img_src(image)}" alt="{html.escape(title)}" loading="lazy" width="640" height="480">'
        f'<div class="bundle-mini__wash" aria-hidden="true"></div>'
        f'<button type="button" aria-label="Открыть карточку: {html.escape(title)}" '
        f'data-detail-open="{html.escape(card_id)}">→</button>'
        f'<div class="bundle-mini__copy">'
        f'{fiction}'
        f'<p>{html.escape(label)}</p>'
        f'<h3>{html.escape(title)}</h3>'
        f'</div></article>'
    )


def render_agenda_section(inline_fn, img_picture_fn, detail_store: list):
    data = _load('agenda-bundles.json')
    cards = []
    nav_items = []
    for b in data['bundles']:
        n = b['num']
        minis = []
        chain_buttons = []
        for kind, key in (('vyzov', 'vyzov'), ('scenario', 'scenario'), ('reshenie', 'reshenie')):
            item = b[key]
            cid = f'agenda-{n}-{key}'
            label = item.get('label') or f'{_KIND_LABEL[kind]} · {n:02d}'
            title = item['title']
            if key == 'reshenie':
                chain_title = b.get('nav_solution_title') or title
            else:
                chain_title = title
            img = item.get('image', '')
            alt = title
            desc = item.get('description', '')
            minis.append(
                _bundle_mini(
                    cid,
                    label,
                    title,
                    desc,
                    img,
                    alt,
                    inline_fn,
                    img_picture_fn,
                    detail_store,
                    fiction_badge=(key == 'scenario'),
                )
            )
            chain_buttons.append(
                f'<button type="button" data-bundle-focus="{n}" data-bundle-kind="{key}">'
                f'<b>{html.escape(_KIND_LABEL[kind])}</b>'
                f'<strong>{html.escape(chain_title)}</strong></button>'
            )
        cards.append(
            f'<article class="bundle-card" tabindex="0" data-bundle="{n}">'
            f'<div class="bundle-card__minis">{"".join(minis)}</div></article>'
        )
        nav_items.append(
            f'<li data-bundle-nav="{n}">'
            f'<div class="bundle-panel__chain">'
            f'<span>{n:02d}</span><div>{"".join(chain_buttons)}</div>'
            f'</div></li>'
        )

    intro = render_narrative_intro(
        data['intro_h2'],
        data['intro_text'],
        inline_fn,
        'agenda-intro',
        extra_html=render_glossary(inline_fn),
        skip_href='#cennosti',
    )
    return (
        intro
        + f'<section class="bundle-scroll" id="agenda" aria-label="Carelink — вызовы, сценарии и решения">'
        f'<div class="bundle-stage" data-bundle-stage>'
        f'<div class="bundle-viewport" data-bundle-viewport>'
        f'<div class="bundle-track" data-bundle-track>{"".join(cards)}</div>'
        f'<button type="button" class="bundle-arrow bundle-arrow--previous" data-bundle-prev '
        f'aria-label="Предыдущая связка" disabled>‹</button>'
        f'<button type="button" class="bundle-arrow bundle-arrow--next" data-bundle-next '
        f'aria-label="Следующая связка">›</button>'
        f'<div class="bundle-progress" aria-hidden="true"><i data-bundle-progress></i></div>'
        f'</div>'
        f'<aside class="bundle-panel">'
        f'<div class="bundle-panel__mobile" data-bundle-mobile>'
        f'<span data-bundle-mobile-counter>01 / 09</span>'
        f'<strong>Вызов · Сценарий · Решение</strong>'
        f'<span class="scroll-stage-hint scroll-stage-hint--desktop">Крутите страницу вниз</span>'
        f'<span class="scroll-stage-hint scroll-stage-hint--mobile">Листайте вбок</span>'
        f'</div>'
        f'<nav aria-label="Связки повестки"><ol data-bundle-nav>{"".join(nav_items)}</ol></nav>'
        f'</aside></div></section>'
    )


def render_manifesto_hero(inline_fn):
    tabs = [
        ('hero-tab-0', 'Данные семьи остаются в России', True,
         'Всё, что семья хранит в Carelink, остаётся на серверах в России.'),
        ('hero-tab-1', 'Общий дом для близких', False,
         'Одно пространство, где у каждого в семье своё место и общая картина.'),
        ('hero-tab-2', 'Идея, которую строим вместе', False,
         'Манифест открыт: мы собираем Carelink вместе с теми, кто рядом.'),
    ]
    chips = []
    for tid, label, selected, panel_text in tabs:
        sel = 'true' if selected else 'false'
        chips.append(
            f'<button type="button" id="{tid}" role="tab" aria-selected="{sel}" '
            f'data-hero-tab data-hero-text="{html.escape(panel_text, quote=True)}">'
            f'{html.escape(label)}</button>'
        )
    first_panel = tabs[0][3]
    return (
        f'<section class="carelink-hero" aria-labelledby="hero-title">'
        f'<img class="carelink-hero__image" src="images/hero-family-table.jpg" '
        f'alt="Вся семья за вечерним чаем" width="1280" height="720" '
        f'fetchpriority="high" decoding="async">'
        f'<div class="carelink-hero__overlay" aria-hidden="true"></div>'
        f'<div class="carelink-hero__content" data-reveal>'
        f'<p class="carelink-hero__kicker">Манифест CareLink · Для тех, кто рядом</p>'
        f'<h1 id="hero-title">Carelink</h1>'
        f'<div class="carelink-hero__subtitle"><i aria-hidden="true"></i>'
        f'<p>вся семья в одном месте</p></div>'
        f'<p class="carelink-hero__standfirst" id="hero-tab-panel" data-hero-standfirst>'
        f'{inline_fn(first_panel)}</p>'
        f'<div class="carelink-hero__chips" role="tablist" aria-label="Темы героя" data-hero-tabs>'
        f'{"".join(chips)}</div>'
        f'<div class="carelink-hero__footer">'
        f'<a class="carelink-hero__cta" href="#agenda"><span aria-hidden="true">→</span>Открыть манифест</a>'
        f'<a class="carelink-hero__secondary" href="#glavy-manifest">Как это устроено →</a>'
        f'</div></div></section>'
    )


def render_chapters_manifesto(inline_fn, img_picture_fn, detail_store: list):
    data = _load('manifesto-chapters-landing.json')
    chapters = data['chapters']
    per_set = 4
    sets = math.ceil(len(chapters) / per_set)
    set_html = []
    nav = []
    for ch in chapters:
        n = ch['num']
        cid = f'chapter-poster-{n}'
        img = ch.get('image', '')
        alt = ch['title']
        detail_store.append(_detail_card_html(
            cid, f'Глава · {n:02d}/20', ch['title'], ch['subtitle'], img, alt, inline_fn, img_picture_fn,
        ))
        nav.append(
            f'<li data-chapter-nav="{n}">'
            f'<button type="button" data-chapter-goto="{n}">'
            f'<span>{n:02d}</span><strong>{html.escape(ch["title"])}</strong></button></li>'
        )

    for si in range(sets):
        chunk = chapters[si * per_set:(si + 1) * per_set]
        cards = []
        for ch in chunk:
            n = ch['num']
            cid = f'chapter-poster-{n}'
            img = ch.get('image', '')
            active = si == 0
            tab = '0' if active else '-1'
            role = ' role="button"' if active else ''
            hidden = '' if active else ' aria-hidden="true"'
            cards.append(
                f'<article class="chapter-card" tabindex="{tab}"{role} data-chapter-card="{n}" '
                f'data-detail-open="{cid}"{hidden} '
                f'aria-label="Открыть главу: {html.escape(ch["title"])}">'
                f'<img src="{_img_src(img)}" alt="{html.escape(ch["title"])}" loading="lazy">'
                f'<div class="chapter-card__shade" aria-hidden="true"></div>'
                f'<div class="chapter-card__copy">'
                f'<p>Глава · {n:02d}/20</p>'
                f'<h3>{html.escape(ch["title"])}</h3>'
                f'<span>{inline_fn(ch.get("teaser") or ch["subtitle"])}</span>'
                f'</div></article>'
            )
        set_hidden = 'false' if si == 0 else 'true'
        set_html.append(
            f'<div class="chapters-set" style="--chapter-set-index:{si}" '
            f'aria-hidden="{set_hidden}">{"".join(cards)}</div>'
        )

    note = _load('landing-editorial.json').get('chapters_intro_note', '')
    extra = f'<p class="narrative-intro__note">{inline_fn(note)}</p>' if note else ''
    intro = render_narrative_intro(
        data['intro_h2'],
        data['intro_text'],
        inline_fn,
        'glavy-intro',
        extra_html=extra,
        skip_href='#top',
        skip_label='Пропустить интерактивный обзор глав — перейти к лонгриду',
    )
    panel_lead = (
        'Манифест — это не правила, а разговор о том, как близким оставаться рядом.'
    )
    return (
        intro
        + f'<section class="chapters-scroll" id="glavy-manifest" style="--chapter-sets:{sets}" '
        f'aria-labelledby="chapters-title">'
        f'<div class="chapters-stage" data-chapters-stage>'
        f'<div class="chapters-viewport" data-chapters-viewport>'
        f'<div class="chapters-sets" data-chapters-sets style="--chapters-progress:0">'
        f'{"".join(set_html)}</div></div>'
        f'<aside class="chapters-panel">'
        f'<div class="chapters-panel__mobile" data-chapters-mobile>'
        f'<span data-chapters-mobile-range>01–04 / 20</span>'
        f'<strong data-chapters-mobile-title>{html.escape(chapters[0]["title"])}</strong>'
        f'<span class="scroll-stage-hint scroll-stage-hint--desktop">Крутите страницу вниз</span>'
        f'<span class="scroll-stage-hint scroll-stage-hint--mobile">Листайте вбок</span>'
        f'</div>'
        f'<div class="chapters-panel__heading">'
        f'<p>{html.escape(panel_lead)}</p>'
        f'<h2 id="chapters-title">Главы</h2>'
        f'<div data-chapters-desktop-range><span>01–04</span><i></i><span>20</span></div>'
        f'</div>'
        f'<nav aria-label="Главы манифеста"><ol data-chapters-nav>{"".join(nav)}</ol></nav>'
        f'</aside></div></section>'
    )


def render_values_row(inline_fn, img_picture_fn, detail_store: list):
    data = _load('site-values.json')
    cards = []
    for item in data['items']:
        cid = item['id']
        img = item.get('image', '')
        alt = item.get('image_alt', item['title'])
        media = img_picture_fn(img, alt, 'values-mini-img', None, 'lazy') if img else ''
        cards.append(
            f'<article class="values-mini agenda-mini">'
            f'{media}'
            f'<div class="agenda-mini-text">'
            f'<span class="mono agenda-mini-label">{html.escape(item["kicker"])}</span>'
            f'<h3 class="agenda-mini-title">{html.escape(item["title"])}</h3>'
            f'<p class="values-mini-teaser">{inline_fn(item.get("teaser", ""))}</p>'
            f'</div>'
            f'<button type="button" class="agenda-mini-read" data-detail-open="{html.escape(cid)}" '
            f'aria-label="Прочитать: {html.escape(item["title"])}"><span aria-hidden="true">→</span></button>'
            f'</article>'
        )
        detail_store.append(_detail_card_html(
            cid, item['kicker'], item['title'], item['description'], img, alt, inline_fn, img_picture_fn,
        ))
    return (
        f'<section class="values-row" id="cennosti" aria-labelledby="cennosti-title">'
        f'<div class="values-row-in section-panel" data-reveal>'
        f'<p class="section-label">Финал</p>'
        f'<h2 id="cennosti-title">{html.escape(data["title"])}</h2>'
        f'<p class="values-row-lead">{html.escape(data.get("lead", ""))}</p>'
        f'</div>'
        f'<div class="values-track" data-values-track>{"".join(cards)}</div>'
        f'</section>'
    )


def render_skills_section(inline_fn, img_picture_fn, detail_store: list):
    data = _load('skills-section.json')
    items_html = []
    for item in data.get('items', []):
        cid = item['id']
        img = item.get('image', '')
        alt = item['title']
        media = img_picture_fn(img, alt, 'skills-card-img', None, 'lazy') if img else ''
        items_html.append(
            f'<article class="skills-card">'
            f'{media}'
            f'<div class="skills-card-body">'
            f'<span class="mono skills-slug">{html.escape(item.get("slug", ""))}</span>'
            f'<h3>{html.escape(item["title"])}</h3>'
            f'<p>{inline_fn(item.get("teaser", ""))}</p>'
            f'<button type="button" class="agenda-mini-read" data-detail-open="{html.escape(cid)}" '
            f'aria-label="Прочитать навык">→</button>'
            f'</div></article>'
        )
        detail_store.append(_detail_card_html(
            cid, f'Навык · {item.get("slug", "")}', item['title'], item['description'], img, alt,
            inline_fn, img_picture_fn,
        ))
    return (
        f'<section class="skills-section" id="navyki" aria-labelledby="navyki-title">'
        f'<div class="skills-in section-panel" data-reveal>'
        f'<p class="section-label">Память проекта</p>'
        f'<h2 id="navyki-title">{html.escape(data["title"])}</h2>'
        f'<p class="skills-lead">{inline_fn(data.get("lead", ""))}</p>'
        f'<div class="skills-grid">{"".join(items_html)}</div>'
        f'</div></section>'
    )


def build_detail_store_entries(detail_store, stash_fn):
    for d in detail_store:
        # refill description from agenda/chapter data already in body
        stash_fn(d['id'], d['kicker'], d['title'], d['body'])


def render_detail_dialog_shell():
    return (
        '<dialog class="detail-dialog" id="detail-dialog" aria-labelledby="detail-dialog-title">'
        '<div class="detail-dialog-panel">'
        '<header class="detail-dialog-head">'
        '<span class="mono detail-dialog-kicker" id="detail-dialog-kicker"></span>'
        '<h2 class="detail-dialog-title" id="detail-dialog-title"></h2>'
        '<button type="button" class="detail-dialog-close chapter-dialog-close" aria-label="Закрыть">×</button>'
        '</header>'
        '<div class="detail-dialog-body landing-card-dialog-body" id="detail-dialog-body"></div>'
        '</div></dialog>'
    )
