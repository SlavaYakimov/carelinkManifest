"""Секции лендинга Figma Make — рендер HTML для tools/build.py."""
import html
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent


def _load(name):
    return json.loads((ROOT / 'tools' / name).read_text(encoding='utf-8'))


def render_intro_block(h2, text, inline_fn, section_id=''):
    sid = f' id="{section_id}"' if section_id else ''
    return (
        f'<section class="manifest-intro section-panel"{sid} data-reveal>'
        f'<div class="manifest-intro-in">'
        f'<h2>{html.escape(h2)}</h2>'
        f'<p>{inline_fn(text)}</p>'
        f'</div></section>'
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


def _mini_card(card_id, kind, item, bundle_num, inline_fn, img_picture_fn):
    label = item.get('label', kind)
    title = item['title']
    desc = item.get('description', '')
    img = item.get('image', '')
    alt = title
    media = img_picture_fn(img, alt, 'agenda-mini-img', None, 'lazy') if img else ''
    return (
        f'<article class="agenda-mini" data-bundle="{bundle_num}">'
        f'{media}'
        f'<div class="agenda-mini-text">'
        f'<span class="mono agenda-mini-label">{html.escape(label)}</span>'
        f'<h3 class="agenda-mini-title">{html.escape(title)}</h3>'
        f'</div>'
        f'<button type="button" class="agenda-mini-read" data-detail-open="{html.escape(card_id)}" '
        f'aria-label="Прочитать: {html.escape(title)}"><span aria-hidden="true">→</span></button>'
        f'</article>'
    ), _detail_card_html(card_id, label, title, desc, img, alt, inline_fn, img_picture_fn)


def render_agenda_section(inline_fn, img_picture_fn, detail_store: list):
    data = _load('agenda-bundles.json')
    bundles_html = []
    nav_lines = []
    for b in data['bundles']:
        n = b['num']
        cols = []
        for kind, key in (('vyzov', 'vyzov'), ('scenario', 'scenario'), ('reshenie', 'reshenie')):
            item = b[key]
            cid = f'agenda-{n}-{key}'
            mini, detail = _mini_card(cid, kind, item, n, inline_fn, img_picture_fn)
            cols.append(mini)
            detail_store.append(detail)
        bundles_html.append(
            f'<div class="agenda-bundle" data-bundle="{n}" id="agenda-bundle-{n:02d}">'
            f'{"".join(cols)}'
            f'</div>'
        )
        p = b['vyzov']['title']
        s = b['scenario']['title']
        r = b.get('nav_solution_title') or b['reshenie']['title']
        nav_lines.append(
            f'<button type="button" class="agenda-nav-line" data-agenda-goto="{n}">'
            f'<span class="agenda-nav-num mono">{n:02d}</span>'
            f'<span class="agenda-nav-text">{html.escape(p)} — {html.escape(s)} — {html.escape(r)}</span>'
            f'</button>'
        )
    intro = render_intro_block(data['intro_h2'], data['intro_text'], inline_fn, 'agenda-intro')
    return (
        intro
        + f'<section class="agenda-pin" id="agenda" aria-labelledby="agenda-heading">'
        f'<div class="agenda-pin-spacer" data-agenda-steps="9"></div>'
        f'<div class="agenda-stage" data-agenda-stage>'
        f'<div class="agenda-main">'
        f'<p class="mono agenda-kicker">CARELINK · МАНИФЕСТ</p>'
        f'<h2 id="agenda-heading" class="agenda-heading">ВЫЗОВЫ · СЦЕНАРИИ · РЕШЕНИЯ</h2>'
        f'<div class="agenda-track-wrap">'
        f'<button type="button" class="agenda-arrow agenda-arrow--prev" data-agenda-prev aria-label="Предыдущая связка">‹</button>'
        f'<div class="agenda-track" data-agenda-track>{"".join(bundles_html)}</div>'
        f'<button type="button" class="agenda-arrow agenda-arrow--next" data-agenda-next aria-label="Следующая связка">›</button>'
        f'</div>'
        f'<div class="agenda-progress" aria-hidden="true"><i data-agenda-progress></i></div>'
        f'</div>'
        f'<aside class="agenda-nav" aria-label="Навигатор связок">'
        f'<p class="mono agenda-nav-title">ВЫЗОВЫ · СЦЕНАРИИ · РЕШЕНИЯ</p>'
        f'<p class="mono agenda-nav-counter" data-agenda-counter>01 / 09</p>'
        f'<div class="agenda-nav-list">{"".join(nav_lines)}</div>'
        f'</aside>'
        f'</div></section>'
    )


def render_manifesto_hero(inline_fn):
    tabs = [
        ('tab-data', 'Данные семьи остаются в России', True,
         'Всё, что семья хранит в Carelink, остаётся на серверах в России.'),
        ('tab-home', 'Общий дом для близких', False,
         'Одно пространство, где у каждого в семье своё место и общая картина.'),
        ('tab-idea', 'Идея, которую строим вместе', False,
         'Манифест открыт: мы собираем Carelink вместе с теми, кто рядом.'),
    ]
    tab_buttons = []
    panels = []
    for tid, label, selected, panel_text in tabs:
        sel = 'true' if selected else 'false'
        tab_idx = '0' if selected else '-1'
        tab_buttons.append(
            f'<button type="button" role="tab" id="{tid}" aria-selected="{sel}" '
            f'aria-controls="{tid}-panel" tabindex="{tab_idx}">{html.escape(label)}</button>'
        )
        hidden = '' if selected else ' hidden'
        panels.append(
            f'<div role="tabpanel" id="{tid}-panel" class="hero-tab-panel" aria-labelledby="{tid}"{hidden}>'
            f'<p>{inline_fn(panel_text)}</p></div>'
        )
    return (
        f'<section class="hero hero--manifesto" aria-labelledby="hero-title">'
        f'<div class="hero-in hero-in--manifesto" data-reveal>'
        f'<p class="mono hero-kicker">МАНИФЕСТ CARELINK · ДЛЯ ТЕХ, КТО РЯДОМ</p>'
        f'<h1 id="hero-title">Carelink</h1>'
        f'<p class="hero-subline">вся семья в одном месте</p>'
        f'<div class="hero-tabs" data-hero-tabs>'
        f'<div role="tablist" class="hero-tablist" aria-label="Темы героя">{"".join(tab_buttons)}</div>'
        f'{"".join(panels)}'
        f'</div>'
        f'<div class="hero-cta-row">'
        f'<a class="btn-hero-primary" href="#agenda">Открыть манифест</a>'
        f'<a class="btn-hero-link" href="#glavy-manifest">Как это устроено →</a>'
        f'</div>'
        f'</div>'
        f'<figure class="hero-img hero-img--manifesto" data-reveal>'
        f'<img src="images/hero-family-table.jpg" alt="Вся семья за вечерним чаем" width="1280" height="720">'
        f'</figure></section>'
    )


def render_chapters_manifesto(inline_fn, img_picture_fn, detail_store: list):
    data = _load('manifesto-chapters-landing.json')
    cards = []
    nav = []
    for ch in data['chapters']:
        n = ch['num']
        cid = f'chapter-poster-{n}'
        img = ch.get('image', '')
        alt = ch['title']
        media = img_picture_fn(img, alt, 'chapter-poster-img', n, 'lazy') if img else ''
        cards.append(
            f'<article class="chapter-poster" data-chapter-poster="{n}">'
            f'<a class="chapter-poster-link" href="#glava-{n}" data-chapter="{n}">'
            f'{media}'
            f'<div class="chapter-poster-caption">'
            f'<span class="mono chapter-poster-num">Глава · {n:02d}/20</span>'
            f'<h3>{html.escape(ch["title"])}</h3>'
            f'<p>{inline_fn(ch["subtitle"])}</p>'
            f'</div>'
            f'</a>'
            f'<button type="button" class="chapter-poster-read" data-detail-open="{cid}" '
            f'aria-label="Открыть главу: {html.escape(ch["title"])}"><span aria-hidden="true">→</span></button>'
            f'</article>'
        )
        nav.append(
            f'<button type="button" class="glavy-nav-item" data-glavy-goto="{n}">'
            f'<span class="mono">{n:02d}</span> {html.escape(ch["title"])}'
            f'</button>'
        )
        detail_store.append(_detail_card_html(
            cid, f'Глава · {n:02d}/20', ch['title'], ch['subtitle'], img, alt, inline_fn, img_picture_fn,
        ))
    intro = render_intro_block(data['intro_h2'], data['intro_text'], inline_fn, 'glavy-intro')
    return (
        intro
        + f'<section class="glavy-pin" id="glavy-manifest" aria-labelledby="glavy-manifest-title">'
        f'<div class="glavy-pin-spacer" data-glavy-steps="5"></div>'
        f'<div class="glavy-stage" data-glavy-stage>'
        f'<div class="glavy-grid-wrap">'
        f'<div class="glavy-grid" data-glavy-grid>{"".join(cards)}</div>'
        f'</div>'
        f'<aside class="glavy-panel" aria-label="Главы манифеста">'
        f'<h2 id="glavy-manifest-title" class="glavy-panel-title">ГЛАВЫ</h2>'
        f'<p class="glavy-panel-lead">Двадцать глав — по четыре на экран. Откройте главу для полного текста в окне.</p>'
        f'<div class="glavy-nav-list" data-glavy-nav>{"".join(nav)}</div>'
        f'</aside>'
        f'</div></section>'
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
        stash_fn(
            d['id'],
            d['kicker'],
            d['title'],
            d['body'],
        )


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
