#!/usr/bin/env python3
"""ARTICLE.md -> index.html (без внешних зависимостей). Запуск: python3 tools/build.py"""
import re, html, pathlib, json, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools'))
from chapter_versions import ensure_chapter_versions, load_v1_markdown, version_inventory
_raw_md = (ROOT / 'ARTICLE.md').read_text(encoding='utf-8')
FINALE_MARKER = '<!-- landing:finale -->'
finale_chunk = None
md = _raw_md
if FINALE_MARKER in _raw_md:
    _head, _tail = _raw_md.split(FINALE_MARKER, 1)
    finale_chunk, _sources_rest = _tail.split('### Об источниках', 1)
    md = _head + '### Об источниках' + _sources_rest
BLOCKS_DATA = json.loads((ROOT / 'tools' / 'chapter-blocks.json').read_text(encoding='utf-8'))
CHALLENGES_DATA = json.loads((ROOT / 'tools' / 'challenges.json').read_text(encoding='utf-8'))
ARCH_DATA = json.loads((ROOT / 'tools' / 'product-architecture.json').read_text(encoding='utf-8'))
DEV_DATA = json.loads((ROOT / 'tools' / 'development.json').read_text(encoding='utf-8'))
FINALE_CTAS_DATA = json.loads((ROOT / 'tools' / 'finale_ctas.json').read_text(encoding='utf-8'))
CHAPTER_IMAGES = json.loads((ROOT / 'tools' / 'chapter-images.json').read_text(encoding='utf-8'))
NUM_CHAPTERS = len(re.findall(r'^## \d+\.', md, re.MULTILINE))
finale_html = ''
IMG_WIDTH, IMG_HEIGHT = 1280, 720


def chapter_image_meta(num):
    return CHAPTER_IMAGES.get(str(num), {})


def resolve_chapter_image_src(num, meta_src='', fig=None):
    src = (meta_src or '').strip()
    if src in ('', 'auto'):
        if fig and fig.get('src'):
            src = fig['src']
        else:
            src = chapter_image_meta(num).get('src', '')
    return src.split('?', 1)[0]


def image_src_with_cache(src, chap_num=None):
    base = src.split('?', 1)[0]
    if chap_num is None:
        return base
    cache = chapter_image_meta(chap_num).get('cache')
    if not cache:
        return base
    return f'{base}?v={cache}'


def img_picture(src, alt, img_class='', chap_num=None, loading='lazy'):
    if not src:
        return ''
    base = src.split('?', 1)[0]
    display_src = image_src_with_cache(base, chap_num)
    esc_src, esc_alt = html.escape(display_src), html.escape(alt)
    webp_base = re.sub(r'\.jpe?g$', '.webp', base, flags=re.I)
    webp_tag = ''
    if webp_base != base and (ROOT / webp_base).is_file():
        webp_display = image_src_with_cache(webp_base, chap_num)
        webp_tag = f'<source type="image/webp" srcset="{html.escape(webp_display)}">'
    cls = f' class="{img_class}"' if img_class else ''
    return (
        f'<picture>{webp_tag}<img src="{esc_src}" alt="{esc_alt}" loading="{html.escape(loading)}" decoding="async" '
        f'width="{IMG_WIDTH}" height="{IMG_HEIGHT}"{cls}></picture>'
    )
PLACEHOLDER = 'Не сформулировано — требует подтверждения'
STRUCT_LABELS = (
    ('image', 'Картинка'),
    ('quote', 'Цитата'),
    ('mission', 'Миссия'),
    ('task', 'Задача'),
    ('hypothesis', 'Гипотеза'),
    ('risks', 'Риски'),
    ('description', 'Описание/объяснение'),
)
chapter_md_raw = {}
for chunk in re.split(r'\n(?=## \d+\.)', md):
    m = re.match(r'## (\d+)\.', chunk)
    if m:
        chapter_md_raw[int(m.group(1))] = chunk.strip()
ensure_chapter_versions(chapter_md_raw, BLOCKS_DATA)
blocks_report = []
source_report = []

OWL_SVG = 'assets/carelink-owl-avatar.svg'
OWL_PNG = 'assets/carelink-owl-128.png'
OWL_VIEW_W, OWL_VIEW_H = 1000, 1120


def owl_img(width, png=False):
    height = max(1, round(width * OWL_VIEW_H / OWL_VIEW_W))
    src = OWL_PNG if png else OWL_SVG
    return (
        f'<img src="{src}" alt="" width="{width}" height="{height}" class="owl-mark" '
        f'decoding="async" loading="lazy">'
    )


BRAND_OWL = f'<span class="owl">{owl_img(40, png=False)}</span>'
FINALE_OWL = f'<span class="landing-finale-owl" aria-hidden="true">{owl_img(36, png=True)}</span>'

ICON = {
    'concept': '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2Zm-2 15v2h4v-2h-4Z"/></svg>',
    'feature': '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"/></svg>',
    'risk': '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z"/></svg>',
    'sources': '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6Zm7 1.5L18.5 9H13V3.5ZM8 13h8v2H8v-2Zm0 4h8v2H8v-2Z"/></svg>',
}

BLOCK_LABEL = {'concept': 'Концепция', 'feature': 'Функция', 'risk': 'Риск', 'sources': 'Источники'}

H3_TYPE = {
    'Из чего состоит Carelink': 'feature',
    'Маяк, а не судья': 'concept',
    'Трезубец Милля': 'concept',
    'Четыре стадии и правда в движении': 'concept',
    'Сначала личный кодекс': 'concept',
    'Теневой кодекс': 'concept',
    'Конституция и ратификация': 'concept',
    'То, что не может отменить никто': 'feature',
    'Медиатор-зеркало': 'feature',
    'Пятничный Пульс': 'feature',
    'Игра, в которой выигрывает клан': 'concept',
    '«Мне нужна пауза»': 'risk',
    'Защита от того, кто рядом': 'risk',
    'Детский профиль': 'risk',
    'Как это задумано': 'concept',
    'Что здесь пока не решено': 'concept',
    'Об источниках': 'sources',
}

CHAPTER_DEFAULT = {
    0: 'feature',
    1: 'concept', 2: 'concept', 3: 'concept', 4: 'concept',
    5: 'concept', 6: 'feature', 7: 'feature', 8: 'concept',
    9: 'risk', 10: 'feature', 11: 'concept', 12: 'concept', 13: 'feature',
    14: 'concept',
    15: 'feature', 16: 'concept', 17: 'concept', 18: 'concept',
    19: 'concept', 20: 'feature',
}

section_log = []


def inline(t):
    t = html.escape(t, quote=False)
    def code(m):
        c = m.group(1)
        if c == 'Концепт':
            return '<span class="badge" title="Не найдено в источниках, требует подтверждения">Концепт</span>'
        return f'<code>{c}</code>'
    t = re.sub(r'`([^`]+)`', code, t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<em>\1</em>', t)
    return t


FINALE_CARD_IMAGE = 'images/family-hearth.jpg'
landing_card_store: list[str] = []


def teaser_from_text(text: str) -> str:
    plain = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    plain = re.sub(r'`([^`]+)`', r'\1', plain)
    return first_sentence(plain)


LANDING_CARD_CTA_LABEL = 'Прочитать'
LANDING_CARD_CTA_HINT = 'панель справа'
CHAPTER_CARD_CTA_LABEL = 'Открыть главу'
CHAPTER_CARD_CTA_HINT = 'окно · структура'


def landing_card_cta_html(
    label: str = LANDING_CARD_CTA_LABEL,
    hint: str = LANDING_CARD_CTA_HINT,
) -> str:
    return (
        f'<footer class="mirai-ticket__foot landing-card-cta" aria-hidden="true">'
        f'<span class="landing-card-read mirai-ticket__pill">{html.escape(label)}</span>'
        f'<span class="landing-card-cta-hint mirai-ticket__meta">{html.escape(hint)}</span>'
        f'</footer>'
    )


def render_landing_card_li(
    card_id: str,
    _num: int,
    title: str,
    image_src: str,
    alt: str,
    *,
    kicker: str = '',
    teaser: str = '',
):
    if not title or not str(title).strip():
        title = 'Без названия'
    if not alt or not str(alt).strip():
        alt = title
    media = ''
    if image_src:
        media = (
            f'<figure class="chapter-grid-media landing-card-media">'
            f'{img_picture(image_src, alt, "chapter-grid-img", loading="eager")}'
            f'</figure>'
        )
    kicker_html = (
        f'<span class="mono landing-card-kicker">{html.escape(kicker)}</span>'
        if kicker
        else ''
    )
    teaser_html = (
        f'<p class="landing-card-teaser">{inline(teaser)}</p>'
        if teaser and teaser.strip()
        else ''
    )
    aria_bits = [title]
    if teaser and teaser.strip():
        aria_bits.append(teaser.strip())
    aria = html.escape(' — '.join(aria_bits), quote=True)
    return (
        f'<li class="chapter-grid-cell landing-ticket-cell">'
        f'<button type="button" class="chapter-grid-card chapter-grid-card--ticket mirai-ticket landing-card-ticket" '
        f'data-landing-card="{html.escape(card_id)}" aria-label="{aria}">'
        f'{kicker_html}'
        f'<h3 class="landing-card-title">{html.escape(title)}</h3>'
        f'{teaser_html}'
        f'{media}'
        f'{landing_card_cta_html()}'
        f'</button></li>'
    )


DRAWER_SECTIONS = (
    ('hypothesis', 'Пока концепт'),
    ('challenges', 'Риск и границы'),
    ('problems', 'В чём боль'),
    ('solutions', 'Ответ манифеста'),
    ('mission', 'Уже сейчас'),
    ('values', 'Принципы'),
)
LANDING_DRAWER_GAPS: list[tuple[str, str]] = []


def note_drawer_gaps(card_id: str, sections: dict) -> None:
    for key, _ in DRAWER_SECTIONS:
        if not (sections.get(key) or '').strip():
            LANDING_DRAWER_GAPS.append((card_id, key))


def drawer_block(text: str, *, as_html: bool = False) -> str:
    if not text or not str(text).strip():
        return ''
    if as_html or str(text).lstrip().startswith('<'):
        return str(text)
    chunks = [p.strip() for p in str(text).split('\n\n') if p.strip()]
    return ''.join(f'<p>{inline(p)}</p>' for p in chunks)


def render_landing_drawer_body(
    card_id: str,
    image_src: str,
    image_alt: str,
    short: str,
    main: str,
    sections: dict | None = None,
    *,
    main_is_html: bool = False,
    section_html: frozenset[str] | None = None,
) -> str:
    sections = dict(sections or {})
    html_sections = section_html or frozenset()
    note_drawer_gaps(card_id, sections)
    parts = []
    if image_src:
        parts.append(
            f'<figure class="landing-drawer-hero">{img_picture(image_src, image_alt, "landing-drawer-hero-img", None, "lazy")}</figure>'
        )
    if short and short.strip():
        parts.append(f'<p class="landing-drawer-short">{inline(short.strip())}</p>')
    if main and str(main).strip():
        parts.append(f'<div class="landing-drawer-main">{drawer_block(main, as_html=main_is_html)}</div>')
    for key, label in DRAWER_SECTIONS:
        raw = (sections.get(key) or '').strip()
        if not raw:
            continue
        parts.append(
            f'<section class="landing-drawer-section landing-drawer-section--{key}">'
            f'<h3 class="landing-drawer-section-title">{label}</h3>'
            f'<div class="landing-drawer-section-body">{drawer_block(raw, as_html=key in html_sections)}</div>'
            f'</section>'
        )
    return ''.join(parts)


def parse_scenario_drawer(body: str) -> tuple[str, dict]:
    sections: dict[str, str] = {}
    main_parts: list[str] = []
    for part in re.split(r'\n\n+', body.strip()):
        m = re.match(r'\*\*(Сейчас|Узнаёте себя):\*\*\s*(.*)', part, re.S)
        if m:
            label, text = m.group(1), m.group(2).strip()
            if label == 'Сейчас':
                main_parts.append(text)
            else:
                sections['challenges'] = text
        else:
            main_parts.append(part.strip())
    main = '\n\n'.join(main_parts)
    hyp = extract_hypothesis_clause(body)
    if hyp:
        sections['hypothesis'] = hyp
    return main, sections


def extract_hypothesis_clause(text: str) -> str:
    paren = re.search(r'\([^)]*Концепт[^)]*\)', text)
    if paren:
        return paren.group(0).strip('()')
    for sent in re.split(r'(?<=[.!?])\s+', text):
        if 'Концепт' in sent or 'концепт' in sent.lower():
            return sent.strip()
    return ''


def classify_finale_paragraph(p_inner: str) -> str:
    plain = re.sub(r'<[^>]+>', '', p_inner).lower()
    if 'уже сейчас' in plain:
        return 'mission'
    if any(
        needle in plain
        for needle in (
            'мы сами создаём',
            'в её собственных руках',
            'в наших руках',
            'safety override',
            'не «платформа решает',
            'не судим',
        )
    ):
        return 'values'
    if any(
        needle in plain
        for needle in ('риск', 'соблазн', 'границ', 'если не', 'опасность', 'может стать')
    ):
        return 'challenges'
    if 'концепт' in plain and any(
        needle in plain for needle in ('v1', 'дорожн', 'чекап', 'главный чат', 'ритуал', 'офлайн')
    ):
        return 'hypothesis'
    return 'solutions'


def parse_finale_modal(modal_html: str) -> tuple[str, dict, frozenset[str]]:
    sections: dict[str, list[str]] = {}
    lead_m = re.search(r'<p class="landing-card-modal-lead">(.*?)</p>', modal_html, re.S)
    main_html = ''
    if lead_m:
        main_html = f'<p class="landing-card-modal-lead">{lead_m.group(1).strip()}</p>'
    for p_inner in re.findall(r'<p>(.*?)</p>', modal_html, re.S):
        kind = classify_finale_paragraph(p_inner)
        sections.setdefault(kind, []).append(f'<p>{p_inner}</p>')
    flat = {k: ''.join(v) for k, v in sections.items()}
    return main_html, flat, frozenset(flat.keys())


def stash_landing_card(card_id: str, kicker: str, title: str, body_html: str):
    landing_card_store.append(
        f'<article class="landing-card-source" id="{html.escape(card_id)}" '
        f'data-kicker="{html.escape(kicker)}" data-title="{html.escape(title)}">'
        f'<div class="landing-card-modal-body landing-drawer-content">{body_html}</div></article>'
    )


def render_finale_cta_li(cta: dict, num: int, total: int):
    card_id = cta['id']
    phrase = cta['phrase']
    img = cta.get('image', '')
    alt = cta.get('image_alt', phrase)
    media = ''
    if img:
        media = (
            f'<figure class="chapter-grid-media landing-card-media finale-cta-media">'
            f'{img_picture(img, alt, "finale-cta-img", None, "eager")}'
            f'</figure>'
        )
    modal_html = cta.get('modal_html', '')
    main_html, sections, html_keys = parse_finale_modal(modal_html)
    for key, frag in (cta.get('drawer_sections') or {}).items():
        if frag and str(frag).strip():
            prev = sections.get(key, '')
            sections[key] = (prev + str(frag)).strip()
            html_keys = html_keys | frozenset({key})
    drawer_short = cta.get('drawer_short') or cta.get('modal_title') or phrase
    drawer_body = render_landing_drawer_body(
        card_id,
        img,
        alt,
        drawer_short,
        main_html,
        sections,
        main_is_html=True,
        section_html=html_keys,
    )
    kicker = cta.get('card_kicker') or f'Ценность · {num:02d}/{total:02d}'
    stash_landing_card(
        card_id,
        cta.get('modal_kicker', kicker),
        cta.get('modal_title', phrase),
        drawer_body,
    )
    teaser = drawer_short if drawer_short != phrase else ''
    aria = html.escape(
        f'{phrase} — {teaser}' if teaser else phrase,
        quote=True,
    )
    teaser_html = (
        f'<p class="landing-card-teaser landing-card-teaser--finale">{inline(teaser)}</p>'
        if teaser
        else ''
    )
    return (
        f'<li class="chapter-grid-cell finale-cta-cell landing-ticket-cell">'
        f'<button type="button" class="chapter-grid-card chapter-grid-card--ticket mirai-ticket landing-card-ticket finale-cta-btn finale-cta-card" '
        f'data-landing-card="{html.escape(card_id)}" aria-label="{aria}">'
        f'<span class="mono landing-card-kicker">{html.escape(kicker)}</span>'
        f'<h3 class="landing-card-title landing-card-title--finale">{inline(phrase)}</h3>'
        f'{teaser_html}'
        f'{media}'
        f'{landing_card_cta_html()}'
        f'</button></li>'
    )


def render_finale_section(chunk):
    title = ''
    paras = []
    foot = ''
    for line in chunk.strip().split('\n'):
        l = line.strip()
        if not l or l.startswith('---'):
            continue
        if l.startswith('## '):
            title = l[3:].strip()
            continue
        if len(l) >= 2 and l.startswith('*') and l.endswith('*') and not l.startswith('**'):
            foot = l.strip('*').strip()
            continue
        paras.append(l)
    body = ''.join(f'<p>{inline(p)}</p>' for p in paras)
    foot_html = f'<p class="landing-finale-foot">{inline(foot)}</p>' if foot else ''
    card_id = 'landing-finale-1'
    fin_title = title or 'Инструмент, чтобы создавать свою реальность'
    fin_sections: dict[str, str] = {}
    if len(paras) > 1:
        fin_sections['solutions'] = '\n\n'.join(paras[1:])
    if foot:
        fin_sections['values'] = foot
    drawer_body = render_landing_drawer_body(
        card_id,
        FINALE_CARD_IMAGE,
        'Семейный очаг — метафора общей реальности',
        fin_title,
        paras[0] if paras else '\n\n'.join(paras),
        fin_sections,
    )
    stash_landing_card(card_id, 'Финальная ценность', fin_title, drawer_body)
    full_body = body + foot_html
    ctas = FINALE_CTAS_DATA.get('ctas', [])
    n_cta = len(ctas)
    cta_cards = [
        render_finale_cta_li(c, i, n_cta) for i, c in enumerate(ctas, 1)
    ]
    cta_lead = FINALE_CTAS_DATA.get('lead', '')
    legacy = (
        f'<div class="landing-block-legacy" id="final-value-legacy">'
        f'<span class="mono landing-finale-kicker">{FINALE_OWL}Финальная ценность</span>'
        f'<h2 class="landing-finale-title">{html.escape(title)}</h2>'
        f'<div class="landing-finale-body">{body}</div>{foot_html}'
        f'<ol class="chapter-grid landing-card-grid">'
        f'{render_landing_card_li(card_id, 1, title or "Финальная ценность", FINALE_CARD_IMAGE, "Семейный очаг — метафора общей реальности")}'
        f'</ol>'
        f'</div>'
    )
    return (
        f'<section class="landing-finale" id="final-value" aria-labelledby="landing-finale-title">'
        f'<div class="landing-finale-in section-panel" data-reveal>'
        f'<p class="section-label landing-finale-label">Финал</p>'
        f'<h2 id="landing-finale-title" class="landing-finale-title landing-finale-title--section">'
        f'Финальная ценность</h2>'
        f'<p class="landing-finale-lead">{html.escape(cta_lead)}</p>'
        f'<ol class="chapter-grid ticket-grid landing-card-grid landing-card-grid--finale landing-card-grid--finale-cta">'
        f'{"".join(cta_cards)}</ol>'
        f'{legacy}'
        f'</div></section>'
    )


def classify_h3(title, chap):
    if title in H3_TYPE:
        return H3_TYPE[title]
    t = title.lower()
    if 'источник' in t:
        return 'sources'
    if any(k in t for k in ('защита', 'пауза', 'риск', 'предохран')):
        return 'risk'
    if any(k in t for k in ('пульс', 'медиатор', 'sos')):
        return 'feature'
    return CHAPTER_DEFAULT.get(chap, 'concept')


def paragraph_block_type(text, chap):
    low = text.lower()
    if 'серьёзные риски' in low:
        return ('risk', 'Серьёзные риски', 'Серьёзные риски (§8)')
    if chap == 6 and 'теневой дневник' in low and 'концепт' in low:
        return ('concept', 'Теневой дневник', 'Теневой дневник (§6)')
    return None


blocks, cur = [], []
lines = md.split('\n')
i = 0
while i < len(lines):
    l = lines[i]
    m = re.match(r'^<!--\s*block:(\w+)\s*-->\s*$', l.strip())
    if m:
        blocks.append(('marker', m.group(1))); i += 1; continue
    if l.startswith('>'):
        q = []
        while i < len(lines) and lines[i].startswith('>'):
            q.append(lines[i][1:].strip()); i += 1
        blocks.append(('quote', [x for x in q if x])); continue
    if l.startswith('!['):
        m = re.match(r'!\[(.*?)\]\((.*?)\)', l)
        cap = ''
        if i + 1 < len(lines) and lines[i+1].startswith('*'):
            cap = lines[i+1].strip('*'); i += 1
        blocks.append(('fig', m.group(1), m.group(2), cap)); i += 1; continue
    if re.match(r'^(- |\d+\. )', l):
        ordered = bool(re.match(r'^\d+\. ', l)); items = []
        while i < len(lines) and re.match(r'^(- |\d+\. )', lines[i]):
            items.append(re.sub(r'^(- |\d+\. )', '', lines[i])); i += 1
        blocks.append(('list', ordered, items)); continue
    if l.startswith('#'):
        n = len(l) - len(l.lstrip('#')); blocks.append(('h', n, l[n:].strip())); i += 1; continue
    if l.strip() == '---':
        blocks.append(('hr',)); i += 1; continue
    if l.strip():
        blocks.append(('p', l.strip()))
    i += 1

title = blocks[0][2]; stand = blocks[1][2]; meta = re.findall(r'`([^`]+)`', blocks[2][1])
body = blocks[3:]
toc, sec_open, chap = [], False, 0
block_open, pending_marker, block_heading = False, None, None
intro_lines, sources_lines, chapter_list, cur_ch = [], [], [], None
active = 'intro'


def emit(line):
    if active == 'intro':
        intro_lines.append(line)
    elif active == 'chapter' and cur_ch is not None:
        cur_ch['lines'].append(line)
    else:
        sources_lines.append(line)


def finish_chapter_section():
    global sec_open
    if not sec_open:
        return
    emit('</div>')
    emit(build_structure_pane(cur_ch))
    emit('</section>')
    sec_open = False
    verify_chapter_source(cur_ch)


def load_blocks_for_version(ch_num, version):
    ch_dir = ROOT / 'chapters' / f'{ch_num:02d}'
    path = ch_dir / ('v2.json' if version == 2 else 'v3.json')
    if path.exists():
        return json.loads(path.read_text(encoding='utf-8'))
    return BLOCKS_DATA.get(str(ch_num), {})


def render_struct_blocks(meta, ch, variant='v2'):
    parts = [f'<div class="struct-blocks struct-blocks--{variant}">']
    for key, label in STRUCT_LABELS:
        if key == 'image':
            fig = ch.get('fig')
            src = resolve_chapter_image_src(ch['num'], meta.get('image') or '', fig)
            if src:
                im = chapter_image_meta(ch['num'])
                alt = (fig['alt'] if fig and fig.get('alt') else '') or im.get('alt', '')
                inner = f'<figure class="struct-fig">{img_picture(src, alt, chap_num=ch["num"])}</figure>'
            else:
                inner = f'<p class="struct-placeholder">{PLACEHOLDER}</p>'
        else:
            text = (meta.get(key) or '').strip()
            if text:
                paras = [p.strip() for p in re.split(r'\n\n+', text) if p.strip()]
                inner = ''.join(f'<p>{inline(p)}</p>' for p in paras)
            else:
                inner = f'<p class="struct-placeholder">{PLACEHOLDER}</p>'
        risk = ' struct-block--risk' if key == 'risks' and (meta.get(key) or '').strip() else ''
        parts.append(
            f'<section class="struct-block struct-block--{key}{risk}">'
            f'<span class="mono struct-lbl">{label}</span>{inner}</section>'
        )
    parts.append('</div>')
    return ''.join(parts)


def render_v1_prose(md_text):
    parts = ['<div class="chapter-v1-prose">']
    if not md_text.strip():
        parts.append(f'<p class="struct-placeholder">{PLACEHOLDER}</p>')
    else:
        for block in re.split(r'\n\n+', md_text.strip()):
            block = block.strip()
            if not block or block.startswith('![') or block.startswith('*Иллюстрация'):
                continue
            if block.startswith('### '):
                parts.append(f'<h3 class="chapter-v1-h3">{inline(block[4:].strip())}</h3>')
                continue
            if block.startswith('>'):
                lines = []
                for ln in block.split('\n'):
                    ln = ln.strip()
                    if ln.startswith('>'):
                        lines.append(ln[1:].strip())
                parts.append(f'<blockquote class="chapter-v1-quote"><p>{inline(" ".join(lines))}</p></blockquote>')
                continue
            flat = re.sub(r'\n', ' ', block)
            parts.append(f'<p>{inline(flat)}</p>')
    parts.append('</div>')
    return ''.join(parts)


def block_fill_report(meta, ch):
    row = {}
    for key, _ in STRUCT_LABELS:
        if key == 'image':
            fig = ch.get('fig')
            src = resolve_chapter_image_src(ch['num'], meta.get('image') or '', fig)
            row[key] = 'filled' if src else 'placeholder'
        else:
            row[key] = 'filled' if (meta.get(key) or '').strip() else 'placeholder'
    return row


def build_structure_pane(ch):
    if not ch:
        return ''
    n = ch['num']
    row = {'chapter': n, 'v1': 'prose', 'v2': {}, 'v3': {}}
    tab_btns = []
    panels = []
    defs = ((1, 'Версия 1'), (2, 'Версия 2'), (3, 'Версия 3'))
    for vnum, vlabel in defs:
        default = vnum == 3
        tab_btns.append(
            f'<button type="button" role="tab" class="chapter-version-tab" '
            f'id="chapter-{n}-version-tab-{vnum}" data-version-tab="{vnum}" '
            f'aria-selected="{"true" if default else "false"}" '
            f'aria-controls="chapter-{n}-version-panel-{vnum}" tabindex="{0 if default else -1}">'
            f'{html.escape(vlabel)}</button>'
        )
        if vnum == 1:
            inner = render_v1_prose(load_v1_markdown(n, chapter_md_raw))
        else:
            meta = load_blocks_for_version(n, vnum)
            variant = 'v2' if vnum == 2 else 'v3'
            inner = render_struct_blocks(meta, ch, variant=variant)
            row[variant] = block_fill_report(meta, ch)
        hidden = '' if default else ' hidden'
        panels.append(
            f'<div role="tabpanel" class="chapter-version-panel chapter-version-panel--v{vnum}" '
            f'id="chapter-{n}-version-panel-{vnum}" data-version-panel="{vnum}" '
            f'aria-labelledby="chapter-{n}-version-tab-{vnum}"{hidden}>{inner}</div>'
        )
    blocks_report.append(row)
    return (
        f'<div class="chapter-pane-structure" data-chapter-versions="{n}">'
        f'<div role="tablist" class="chapter-version-tablist" aria-label="Версии структуры">'
        f'{"".join(tab_btns)}</div>{"".join(panels)}</div>'
    )


def normalize_plain(t):
    t = re.sub(r'`([^`]+)`', r'\1', t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'\1', t)
    t = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'\1', t)
    t = re.sub(r'!\[[^\]]*\]\([^)]+\)', ' ', t)
    t = re.sub(r'^#+\s*', '', t, flags=re.M)
    t = re.sub(r'^>\s?', '', t, flags=re.M)
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def verify_chapter_source(ch):
    n = ch['num']
    raw = chapter_md_raw.get(n, '')
    raw_body = re.sub(r'^## \d+\.[^\n]*\n', '', raw, count=1)
    raw_body = re.sub(r'\n---\s*$', '', raw_body.strip())
    src_html = '\n'.join(ch['lines'])
    html_plain = normalize_plain(re.sub(r'<[^>]+>', ' ', html.unescape(src_html)))
    md_words = len(re.findall(r'[\wёЁ-]+', raw_body, flags=re.I))
    html_words = len(re.findall(r'[\wёЁ-]+', html_plain, flags=re.I))
    word_ratio = html_words / md_words if md_words else 1
    # HTML may add figcaption/badge words; it must not omit chapter body text.
    ok = html_words >= int(md_words * 0.90)
    source_report.append({
        'chapter': n,
        'match': ok,
        'md_words': md_words,
        'html_words': html_words,
        'word_ratio': round(word_ratio, 4),
    })


def first_sentence(text):
    plain = re.sub(r'`([^`]+)`', r'\1', text)
    plain = re.sub(r'\*\*([^*]+)\*\*', r'\1', plain)
    plain = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'\1', plain)
    plain = plain.strip()
    m = re.match(r'.+?[.!?…](?:\s|$|[»"])', plain)
    return (m.group(0).strip() if m else plain[:180]).strip()


def render_quote(q):
    first = q[0]
    if first.startswith('**Сценари'):
        lab = re.match(r'\*\*(.+?)\*\*', first).group(1).rstrip('.')
        rest = [re.sub(r'^\*\*.+?\*\*\s*', '', first)] + q[1:]
        rows = []
        for r in rest:
            if not r: continue
            m = re.match(r'^\*\*(.+?):\*\*\s*(.*)$', r)
            if m:
                who = m.group(1)
                cls = 'bot' if who.startswith('Carelink') else 'hum'
                rows.append(f'<p class="ln {cls}"><span class="who mono">{inline(who)}</span><span class="say">{inline(m.group(2))}</span></p>')
            else:
                m2 = re.match(r'^\*\*(.+?)\*\*\s*(.*)$', r)
                if m2 and len(m2.group(1)) < 30:
                    rows.append(f'<p class="ln hum"><span class="who mono">{inline(m2.group(1))}</span><span class="say">{inline(m2.group(2))}</span></p>')
                else:
                    rows.append(f'<p>{inline(r)}</p>')
        return f'<aside class="vignette"><span class="mono lbl">◇ {html.escape(lab)}</span>{"".join(rows)}</aside>'
    if first.startswith('**Вопрос'):
        lab = re.match(r'\*\*(.+?)\*\*', first).group(1).rstrip('.')
        rest = [re.sub(r'^\*\*.+?\*\*\s*', '', first)] + q[1:]
        ps = ''.join(f'<p>{inline(r)}</p>' for r in rest if r)
        return f'<aside class="question"><span class="mono lbl">? {html.escape(lab)}</span>{ps}</aside>'
    if first.startswith('**'):
        lab = re.match(r'\*\*(.+?)\*\*', first).group(1).rstrip('.')
        rest = [re.sub(r'^\*\*.+?\*\*\s*', '', first)] + q[1:]
        ps = ''.join(f'<p>{inline(r)}</p>' for r in rest if r)
        return f'<aside class="note"><span class="mono lbl">i · {html.escape(lab)}</span>{ps}</aside>'
    cite = ''
    if len(q) > 1 and q[-1].startswith('—'):
        cite = f'<cite class="mono">{inline(q[-1])}</cite>'; q = q[:-1]
    return f'<blockquote class="pull"><p>{inline(" ".join(q))}</p>{cite}</blockquote>'


def close_block():
    global block_open, block_heading
    if block_open:
        emit('</div></section>')
        block_open = False
        block_heading = None


def open_block(btype, heading=None, log_key=None, block_id=None):
    global block_open, block_heading
    close_block()
    if log_key:
        section_log.append({'type': btype, 'label': log_key})
    lab = BLOCK_LABEL[btype]
    ico = ICON[btype]
    h = f'<h3 class="block-title">{inline(heading)}</h3>' if heading else ''
    id_attr = f' id="{block_id}"' if block_id else ''
    extra = ' sources' if btype == 'sources' else ''
    emit(
        f'<section class="block block--{btype}{extra}"{id_attr}>'
        f'<header class="block-h"><span class="block-ico">{ico}</span><span class="mono block-lbl">{lab}</span>{h}</header>'
        f'<div class="block-body">'
    )
    block_open = True
    block_heading = heading


def ensure_block(btype, heading=None, log_key=None):
    if not block_open or (heading and block_heading != heading):
        open_block(btype, heading, log_key=log_key or heading or f'Глава {chap:02d}' if chap else 'Вступление')


def render_content(b):
    k = b[0]
    if k == 'p':
        if active == 'chapter' and cur_ch is not None and cur_ch.get('teaser') is None:
            cur_ch['teaser'] = first_sentence(b[1])
        emit(f'<p>{inline(b[1])}</p>')
    elif k == 'list':
        tag = 'ol' if b[1] else 'ul'
        emit(f'<{tag}>' + ''.join(f'<li>{inline(x)}</li>' for x in b[2]) + f'</{tag}>')
    elif k == 'quote':
        emit(render_quote(b[1]))
    elif k == 'fig':
        _, alt, src, cap = b
        num, _, rest = cap.partition(' · ')
        if active == 'chapter' and cur_ch is not None and 'fig' not in cur_ch:
            cur_ch['fig'] = {'src': src, 'alt': alt}
        emit(
            f'<figure class="ill">{img_picture(src, alt)}'
            f'<figcaption><span class="mono">{inline(num)}</span><span>{inline(rest)}</span></figcaption></figure>'
        )


for b in body:
    k = b[0]
    if k == 'marker':
        pending_marker = b[1]
        continue
    if k == 'h' and b[1] == 2:
        close_block()
        finish_chapter_section()
        m = re.match(r'(\d+)\.\s*(.+)', b[2])
        chap = int(m.group(1)); name = m.group(2)
        sid = f'glava-{chap}'
        toc.append((sid, chap, name))
        active = 'chapter'
        cur_ch = {'num': chap, 'title': name, 'teaser': None, 'lines': [], 'fig': None}
        chapter_list.append(cur_ch)
        emit(f'<section class="chapter" id="{sid}" data-chapter="{chap}" tabindex="-1"><header class="ch-h"><span class="mono">Глава {chap:02d} / {NUM_CHAPTERS}</span><h2>{inline(name)}</h2></header><div class="chapter-pane-source">')
        sec_open = True
        pending_marker = None
    elif k == 'h' and b[1] == 3 and b[2] == 'Об источниках':
        close_block()
        finish_chapter_section()
        active = 'sources'
        open_block('sources', 'Об источниках', 'Об источниках', block_id='sources')
        pending_marker = None
    elif k == 'h' and b[1] == 3:
        btype = pending_marker if pending_marker in BLOCK_LABEL else classify_h3(b[2], chap)
        pending_marker = None
        open_block(btype, b[2], b[2])
    elif k == 'h':
        ensure_block(CHAPTER_DEFAULT.get(chap, 'concept'))
        emit(f'<h4 class="block-sub">{inline(b[2])}</h4>')
    elif k == 'p':
        ptype = paragraph_block_type(b[1], chap)
        if ptype:
            open_block(ptype[0], ptype[1], ptype[2])
        elif not block_open:
            default = pending_marker if pending_marker in BLOCK_LABEL else CHAPTER_DEFAULT.get(chap, 'feature')
            pending_marker = None
            log_key = f'Глава {chap:02d}' if chap else 'Вступление'
            open_block(default, log_key=log_key)
        render_content(b)
    elif k in ('list', 'quote', 'fig'):
        if not block_open:
            ensure_block(CHAPTER_DEFAULT.get(chap, 'concept'))
        render_content(b)
    elif k == 'hr':
        close_block()
        pending_marker = None

close_block()
finish_chapter_section()

for ch in chapter_list:
    if not ch.get('teaser'):
        ch['teaser'] = ch['title']

landing_items = []
for ch in chapter_list:
    n = ch['num']
    im = chapter_image_meta(n)
    src = resolve_chapter_image_src(n, BLOCKS_DATA.get(str(n), {}).get('image', ''), ch.get('fig'))
    alt = im.get('alt') or (ch.get('fig') or {}).get('alt', ch['title'])
    lead = html.escape(ch['teaser'])
    media = (
        f'<figure class="chapter-grid-media">{img_picture(src, alt, "chapter-grid-img", n)}</figure>'
        if src else ''
    )
    kicker = f'Глава · {n:02d}/{NUM_CHAPTERS:02d}'
    if media and 'landing-card-media' not in media:
        media = media.replace(
            'class="chapter-grid-media"',
            'class="chapter-grid-media landing-card-media"',
            1,
        )
    landing_items.append(
        f'<li class="chapter-grid-cell landing-ticket-cell">'
        f'<a class="chapter-grid-card chapter-grid-card--ticket mirai-ticket landing-card-ticket" '
        f'href="#glava-{n}" data-chapter="{n}" '
        f'aria-label="{html.escape(ch["title"] + " — " + ch["teaser"], quote=True)}">'
        f'<span class="mono landing-card-kicker">{html.escape(kicker)}</span>'
        f'<h3 class="landing-card-title">{html.escape(ch["title"])}</h3>'
        f'<p class="landing-card-teaser">{lead}</p>'
        f'{media}'
        f'{landing_card_cta_html(CHAPTER_CARD_CTA_LABEL, CHAPTER_CARD_CTA_HINT)}'
        f'</a></li>'
    )
landing_html = '\n'.join(landing_items)
chapter_html = '\n'.join('\n'.join(ch['lines']) for ch in chapter_list)
intro_html = '\n'.join(intro_lines)
sources_html = '\n'.join(sources_lines)

toc_html = ''.join(f'<li><a href="#glava-{n}"><span class="mono">{n:02d}</span>{html.escape(name)}</a></li>' for sid, n, name in toc)
meta_html = ''.join(f'<span class="chip mono">{html.escape(m)}</span>' for m in meta)
t1, _, t2 = title.partition(': ')
H1 = (f'<span>{html.escape(t1)}</span> <span class="thin">{html.escape(t2)}</span>' if t2 else f'<span>{html.escape(t1)}</span>')
words = len(re.findall(r'[\wёЁ-]+', re.sub(r'[`*#>!\[\]()]', ' ', md)))


def render_challenges_section():
    d = CHALLENGES_DATA
    n_prob = len(d['problems'])
    problems = []
    problem_cards = []
    for i, p in enumerate(d['problems'], 1):
        card_id = f'problem-{i}'
        problems.append(
            f'<li class="challenge-item">'
            f'<span class="mono challenge-num">{i:02d}</span>'
            f'<div class="challenge-body">'
            f'<span class="badge challenge-problem-badge">Проблема</span>'
            f'<h3 class="challenge-title">{html.escape(p["title"])}</h3>'
            f'<p class="challenge-desc">{inline(p["description"])}</p>'
            f'</div></li>'
        )
        drawer_body = render_landing_drawer_body(
            card_id,
            p.get('image', ''),
            p['title'],
            p['title'],
            first_sentence(p['description']),
            {
                'problems': p['description'],
                'solutions': p.get('response', ''),
            },
        )
        kicker = f'Проблема · {i:02d}/{n_prob:02d}'
        stash_landing_card(card_id, kicker, p['title'], drawer_body)
        img = p.get('image', '')
        alt = p['title']
        problem_cards.append(
            render_landing_card_li(
                card_id,
                i,
                p['title'],
                img,
                alt,
                kicker=kicker,
                teaser=teaser_from_text(p['description']),
            )
        )
    examples = []
    scenario_cards = []
    for i, ex in enumerate(d['examples'], 1):
        examples.append(
            f'<aside class="challenge-example">'
            f'<span class="badge challenge-example-badge">Сценарий</span>'
            f'<h4 class="challenge-example-title">{html.escape(ex["title"])}</h4>'
            f'<p>{inline(ex["body"])}</p>'
            f'</aside>'
        )
        card_id = f'scenario-{i}'
        main, sections = parse_scenario_drawer(ex['body'])
        drawer_body = render_landing_drawer_body(
            card_id,
            ex.get('image', ''),
            ex['title'],
            ex['title'],
            main,
            sections,
        )
        n_sc = len(d['examples'])
        kicker = f'Сценарий · {i:02d}/{n_sc:02d}'
        stash_landing_card(card_id, kicker, ex['title'], drawer_body)
        scenario_cards.append(
            render_landing_card_li(
                card_id,
                i,
                ex['title'],
                ex.get('image', ''),
                ex['title'],
                kicker=kicker,
                teaser=teaser_from_text(main),
            )
        )
    examples_note = d.get('examples_note', '')
    n_ex = len(d['examples'])
    note_html = f'<p class="challenges-examples-note">{inline(examples_note)}</p>' if examples_note else ''
    return (
        f'<section class="challenges" id="vyzovy" aria-labelledby="challenges-title">'
        f'<div class="challenges-in section-panel" data-reveal>'
        f'<p class="section-label">Вызовы</p>'
        f'<h2 id="challenges-title" class="challenges-title">Проблемы семьи</h2>'
        f'<p class="challenges-intro">{inline(d["intro"])}</p>'
        f'<h3 class="mono landing-card-grid-lbl">Выберите проблему · {n_prob} карточек</h3>'
        f'<ol class="chapter-grid ticket-grid landing-card-grid landing-card-grid--problems">{"".join(problem_cards)}</ol>'
        f'<div class="landing-block-legacy" id="vyzovy-problems-legacy">'
        f'<ol class="challenge-list">{"".join(problems)}</ol>'
        f'</div>'
        f'<div class="challenge-examples">'
        f'<span class="mono challenges-examples-lbl">Сценарии</span>'
        f'{note_html}'
        f'<h3 class="mono landing-card-grid-lbl">Выберите сценарий · {n_ex} карточек</h3>'
        f'<ol class="chapter-grid ticket-grid landing-card-grid landing-card-grid--scenarios">{"".join(scenario_cards)}</ol>'
        f'<div class="landing-block-legacy" id="vyzovy-scenarios-legacy">'
        f'<div class="challenge-examples-grid">{"".join(examples)}</div>'
        f'</div>'
        f'</div></div></section>'
    )


def render_solutions_section():
    d = CHALLENGES_DATA
    featured_legacy = []
    featured_cards = []
    featured = d.get('featured_solutions', [])
    n_feat = len(featured)
    for i, f in enumerate(featured, 1):
        card_id = f'solution-featured-{i}'
        drawer_body = render_landing_drawer_body(
            card_id,
            f.get('image', ''),
            f['title'],
            f['title'],
            first_sentence(f['description']),
            {
                'problems': f'Связанная проблема: «{f["problem_ref"]}».',
                'solutions': f['description'],
            },
        )
        kicker = f'Решение · {i:02d}/{n_feat:02d}'
        stash_landing_card(card_id, kicker, f['title'], drawer_body)
        featured_cards.append(
            render_landing_card_li(
                card_id,
                i,
                f['title'],
                f.get('image', ''),
                f['title'],
                kicker=kicker,
                teaser=teaser_from_text(f['description']),
            )
        )
        featured_legacy.append(
            f'<li class="solution-item solution-item--featured">'
            f'<span class="mono solution-num">{i:02d}</span>'
            f'<div class="solution-body">'
            f'<span class="badge solution-way-badge">Способ</span>'
            f'<h3 class="solution-way-title">{html.escape(f["title"])}</h3>'
            f'<p class="solution-problem-ref">'
            f'<span class="mono solution-problem-lbl">К проблеме</span> '
            f'{html.escape(f["problem_ref"])}</p>'
            f'<p class="solution-text">{inline(f["description"])}</p>'
            f'</div></li>'
        )
    items = []
    for i, p in enumerate(d['problems'], 1):
        items.append(
            f'<li class="solution-item">'
            f'<span class="mono solution-num">{i:02d}</span>'
            f'<div class="solution-body">'
            f'<h3 class="solution-for">{html.escape(p["title"])}</h3>'
            f'<p class="solution-text">{inline(p["response"])}</p>'
            f'</div></li>'
        )
    intro = d.get('solutions_intro', '')
    detail_lbl = d.get('solutions_detail_lbl', '')
    detail_html = (
        f'<p class="mono solutions-detail-lbl">{html.escape(detail_lbl)}</p>'
        if detail_lbl else ''
    )
    cards_html = (
        f'<h3 class="mono landing-card-grid-lbl">Три опоры · {n_feat} карточки</h3>'
        f'<ol class="chapter-grid ticket-grid landing-card-grid landing-card-grid--solutions">'
        f'{"".join(featured_cards)}</ol>'
        if featured_cards else ''
    )
    return (
        f'<section class="solutions" id="resheniya" aria-labelledby="solutions-title">'
        f'<div class="solutions-in section-panel" data-reveal>'
        f'<p class="section-label">Решения</p>'
        f'<h2 id="solutions-title" class="solutions-title">Решения</h2>'
        f'<p class="solutions-intro">{inline(intro)}</p>'
        f'<p class="solutions-lead">Каждая карточка — один способ из манифеста. Нажмите «Прочитать» — справа откроется панель с полным текстом и связью с проблемой.</p>'
        f'{cards_html}'
        f'<div class="landing-block-legacy" id="resheniya-legacy">'
        f'<ol class="solution-list solution-list--featured">{"".join(featured_legacy)}</ol>'
        f'{detail_html}'
        f'<ol class="solution-list solution-list--detail">{"".join(items)}</ol>'
        f'</div>'
        f'</div></section>'
    )


def dev_status_badge(needs_confirmation: bool) -> str:
    if needs_confirmation:
        return (
            '<span class="badge dev-badge dev-badge--unconfirmed" '
            'title="Не подтверждено первоисточником или статусом команды">'
            'требует подтверждения</span>'
        )
    return ''


def render_development_section():
    d = DEV_DATA
    done_items = []
    for i, it in enumerate(d.get('done', []), 1):
        done_items.append(
            f'<li class="dev-item dev-item--done">'
            f'<span class="mono dev-num">{i:02d}</span>'
            f'<div class="dev-body">'
            f'<h3 class="dev-title">{html.escape(it["title"])}</h3>'
            f'<p class="dev-desc">{inline(it["description"])}</p>'
            f'</div></li>'
        )
    prog_items = []
    for i, it in enumerate(d.get('in_progress', []), 1):
        badge = dev_status_badge(bool(it.get('needs_confirmation')))
        prog_items.append(
            f'<li class="dev-item dev-item--progress">'
            f'<span class="mono dev-num">{i:02d}</span>'
            f'<div class="dev-body">'
            f'{badge}'
            f'<h3 class="dev-title">{html.escape(it["title"])}</h3>'
            f'<p class="dev-desc">{inline(it["description"])}</p>'
            f'</div></li>'
        )
    return (
        f'<section class="development" id="razrabotka" aria-labelledby="development-title">'
        f'<div class="development-in section-panel" data-reveal>'
        f'<p class="section-label">Разработка</p>'
        f'<h2 id="development-title" class="development-title">Разработка</h2>'
        f'<p class="development-intro">{inline(d["intro"])}</p>'
        f'<div class="dev-columns">'
        f'<div class="dev-column">'
        f'<h3 class="mono dev-column-lbl">{html.escape(d.get("done_label", "Уже сделано"))}</h3>'
        f'<ol class="dev-list dev-list--done">{"".join(done_items)}</ol>'
        f'</div>'
        f'<div class="dev-column">'
        f'<h3 class="mono dev-column-lbl">{html.escape(d.get("in_progress_label", "В работе"))}</h3>'
        f'<ol class="dev-list dev-list--progress">{"".join(prog_items)}</ol>'
        f'</div>'
        f'</div></div></section>'
    )


def render_product_architecture_section():
    d = ARCH_DATA
    cards = []
    for i, it in enumerate(d['items'], 1):
        note = it.get('note', '')
        badge = ''
        if note == 'direction':
            badge = (
                '<span class="badge product-arch-badge product-arch-badge--direction" '
                'title="Направление, не подтверждённый релиз v1">требует подтверждения</span>'
            )
        elif note == 'partial':
            badge = (
                '<span class="badge product-arch-badge product-arch-badge--partial" '
                'title="Частично описано в манифесте">требует подтверждения</span>'
            )
        cards.append(
            f'<li class="product-arch-item">'
            f'<span class="mono product-arch-num">{i:02d}</span>'
            f'<div class="product-arch-body">'
            f'{badge}'
            f'<h3 class="product-arch-title">{html.escape(it["title"])}</h3>'
            f'<p class="product-arch-desc">{inline(it["description"])}</p>'
            f'</div></li>'
        )
    return (
        f'<section class="product-arch" id="product-arch" aria-labelledby="product-arch-title">'
        f'<div class="product-arch-in section-panel" data-reveal>'
        f'<p class="section-label">Архитектура</p>'
        f'<h2 id="product-arch-title" class="product-arch-title-main">Архитектура</h2>'
        f'<p class="product-arch-intro">{inline(d["intro"])}</p>'
        f'<ol class="product-arch-grid">{"".join(cards)}</ol>'
        f'</div></section>'
    )


challenges_html = render_challenges_section()
solutions_html = render_solutions_section()
development_html = render_development_section()
product_arch_html = render_product_architecture_section()
if finale_chunk:
    finale_html = render_finale_section(finale_chunk)

page = f'''<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)} — манифест Carelink</title>
<meta name="description" content="{html.escape(stand)}">
<meta property="og:title" content="{html.escape(title)} — манифест Carelink">
<meta property="og:description" content="{html.escape(stand)}">
<meta property="og:image" content="images/hero-family-table.jpg">
<link rel="icon" href="assets/carelink-owl-128.png" type="image/png" sizes="128x128">
<link rel="apple-touch-icon" href="assets/carelink-owl-128.png">
<link rel="stylesheet" href="assets/style.css">
<link rel="stylesheet" href="assets/motion.css">
</head>
<body>
<a class="skip" href="#top">К основному содержимому</a>
<div class="progress" aria-hidden="true"><i id="bar"></i></div>
<header class="top">
  <a class="brand" href="#top" aria-label="Carelink">{BRAND_OWL}<span class="bt"><b>Carelink</b><small>Спокойная забота</small></span></a>
  <nav class="top-nav mono" aria-label="Разделы"><a href="#vyzovy">Вызовы</a><a href="#resheniya">Решения</a><a href="#glavy">Главы</a><a href="#razrabotka">Разработка</a><a href="#product-arch">Архитектура</a><a href="#final-value">Ценность</a></nav>
  <span class="mono top-l">Манифест · живой лонгрид</span>
  <span class="mono top-r">{words} слов · {NUM_CHAPTERS} глав</span>
</header>
<main id="top">
<section class="hero">
  <div class="hero-in" data-reveal>
    <h1>{H1}</h1>
    <p class="stand">{inline(stand)}</p>
    <div class="chips">{meta_html}</div>
  </div>
  <figure class="hero-img"><img src="images/hero-family-table.jpg" alt="Вся семья за вечерним чаем"  width="1280" height="720"></figure>
</section>
{challenges_html}
{solutions_html}
<section class="chapter-index" id="glavy" aria-labelledby="chapter-index-title">
  <div class="chapter-index-in section-panel" data-reveal>
    <p class="section-label">Главы</p>
    <h2 id="chapter-index-title" class="chapter-index-title">{NUM_CHAPTERS} глав манифеста</h2>
    <p class="chapter-index-lead">Выберите главу — откроется окно со структурой, иллюстрацией и исходным текстом (вкладки «Структура» и «Исходный текст»).</p>
  </div>
  <div class="chapter-index-bleed section-panel" data-reveal>
    <ol class="chapter-grid chapter-grid--bleed ticket-grid">{landing_html}</ol>
  </div>
</section>
{development_html}
{product_arch_html}
<div class="layout">
  <nav class="toc" aria-label="Оглавление"><span class="mono">Содержание</span><ol>{toc_html}<li><a href="#sources"><span class="mono">··</span>Об источниках</a></li></ol></nav>
  <article class="article read-stream">
    <div class="read-lead">{intro_html}</div>
    <div class="read-chapters">{chapter_html}</div>
    <div class="read-tail">{sources_html}</div>
  </article>
</div>
{finale_html}
</main>
<div id="landing-card-store" hidden aria-hidden="true">{''.join(landing_card_store)}</div>
<div class="landing-drawer" id="landing-card-drawer" hidden aria-hidden="true">
  <button type="button" class="landing-drawer-overlay" id="landing-card-drawer-overlay" aria-label="Закрыть панель" tabindex="-1"></button>
  <div class="landing-drawer-sheet" role="dialog" aria-modal="true" aria-labelledby="landing-card-drawer-title" id="landing-card-drawer-panel">
    <header class="landing-drawer-head">
      <span class="mono landing-drawer-kicker" id="landing-card-drawer-kicker"></span>
      <h2 class="landing-drawer-title" id="landing-card-drawer-title"></h2>
      <button type="button" class="landing-drawer-close chapter-dialog-close" id="landing-card-drawer-close" aria-label="Закрыть панель">×</button>
    </header>
    <div class="landing-drawer-body landing-card-dialog-body" id="landing-card-drawer-body"></div>
  </div>
</div>
<dialog class="chapter-dialog" id="chapter-dialog" aria-modal="true" aria-labelledby="chapter-dialog-title">
  <div class="chapter-dialog-panel">
    <header class="chapter-dialog-head">
      <span class="mono chapter-dialog-kicker" id="chapter-dialog-kicker">Глава 01 / {NUM_CHAPTERS}</span>
      <h2 class="chapter-dialog-title" id="chapter-dialog-title"></h2>
      <button type="button" class="chapter-dialog-close" aria-label="Закрыть главу">×</button>
    </header>
    <div class="chapter-dialog-body" id="chapter-dialog-body">
      <div class="chapter-tabs" data-chapter-tabs>
        <div role="tablist" class="chapter-tablist" aria-label="Режим просмотра главы">
          <button type="button" role="tab" id="chapter-tab-structure" aria-selected="true" aria-controls="chapter-panel-structure" tabindex="0">Структура</button>
          <button type="button" role="tab" id="chapter-tab-source" aria-selected="false" aria-controls="chapter-panel-source" tabindex="-1">Исходный текст</button>
        </div>
        <div role="tabpanel" id="chapter-panel-structure" class="chapter-tabpanel is-active" aria-labelledby="chapter-tab-structure"></div>
        <div role="tabpanel" id="chapter-panel-source" class="chapter-tabpanel" aria-labelledby="chapter-tab-source" hidden></div>
      </div>
    </div>
    <footer class="chapter-dialog-foot">
      <button type="button" class="btn-nav" id="chapter-prev" aria-label="Предыдущая глава">← Предыдущая</button>
      <button type="button" class="btn-nav" id="chapter-next" aria-label="Следующая глава">Следующая →</button>
    </footer>
  </div>
</dialog>
<footer class="foot">
  <a class="brand" href="#top">{BRAND_OWL}<span class="bt"><b>Carelink</b><small>Спокойная забота</small></span></a>
  <span class="mono">© 2026 Carelink · Слава Якимов</span>
  <span class="mono"><span class="badge">Концепт</span> — ещё обсуждается</span>
</footer>
<script src="assets/site.js" defer></script>
<script src="assets/chapters.js" defer></script>
<script src="assets/landing-cards.js" defer></script>
</body>
</html>
'''
(ROOT / 'index.html').write_text(page, encoding='utf-8')
(ROOT / 'tools' / 'section-types.json').write_text(json.dumps(section_log, ensure_ascii=False, indent=2), encoding='utf-8')
(ROOT / 'tools' / 'chapter-blocks-report.json').write_text(json.dumps(blocks_report, ensure_ascii=False, indent=2), encoding='utf-8')
(ROOT / 'tools' / 'chapter-source-report.json').write_text(json.dumps(source_report, ensure_ascii=False, indent=2), encoding='utf-8')
print('ok words', words, 'chapters', len(toc), 'blocks', len(section_log), 'source_ok', all(r['match'] for r in source_report))
inv = version_inventory()
print('\n=== Chapter version files ===')
for row in inv:
    print(f"  Ch {row['chapter']:2d}: {', '.join(row['versions']) or '(none)'}")
empty_v3 = []
for rep in blocks_report:
    v3 = rep.get('v3') or {}
    for k, st in v3.items():
        if st == 'placeholder':
            empty_v3.append(f"ch{rep['chapter']}:{k}")
if empty_v3:
    print('v3 placeholders:', ', '.join(empty_v3))
if LANDING_DRAWER_GAPS:
    print('\n=== Landing drawer empty sections (flag in PR, not on site) ===')
    for cid, sec in LANDING_DRAWER_GAPS:
        label = dict(DRAWER_SECTIONS).get(sec, sec)
        print(f'  {cid} · {label}')
