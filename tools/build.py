#!/usr/bin/env python3
"""ARTICLE.md -> index.html (без внешних зависимостей). Запуск: python3 tools/build.py"""
import re, html, pathlib, json
ROOT = pathlib.Path(__file__).resolve().parent.parent
md = (ROOT / 'ARTICLE.md').read_text(encoding='utf-8')
BLOCKS_DATA = json.loads((ROOT / 'tools' / 'chapter-blocks.json').read_text(encoding='utf-8'))
CHALLENGES_DATA = json.loads((ROOT / 'tools' / 'challenges.json').read_text(encoding='utf-8'))
CHAPTER_IMAGES = json.loads((ROOT / 'tools' / 'chapter-images.json').read_text(encoding='utf-8'))
NUM_CHAPTERS = len(re.findall(r'^## \d+\.', md, re.MULTILINE))
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
    return src


def img_picture(src, alt, img_class=''):
    if not src:
        return ''
    esc_src, esc_alt = html.escape(src), html.escape(alt)
    webp = re.sub(r'\.jpe?g$', '.webp', src, flags=re.I)
    webp_tag = ''
    if webp != src and (ROOT / webp).is_file():
        webp_tag = f'<source type="image/webp" srcset="{html.escape(webp)}">'
    cls = f' class="{img_class}"' if img_class else ''
    return (
        f'<picture>{webp_tag}<img src="{esc_src}" alt="{esc_alt}" loading="lazy" decoding="async" '
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
blocks_report = []
source_report = []

OWL = ('<svg viewBox="0 0 512 512" width="24" height="24" fill="#fff" aria-hidden="true"><path fill-rule="evenodd" d="M132 60 L196 132 Q256 116 316 132 L380 60 L392 168 Q440 226 440 300 Q440 410 352 456 Q306 480 256 480 Q206 480 160 456 Q72 410 72 300 Q72 226 120 168 Z M190 168 a70 70 0 1 0 0.1 0 Z M322 168 a70 70 0 1 0 0.1 0 Z M256 270 L238 300 L256 336 L274 300 Z M214 372 q14 18 28 0 q-14 8 -28 0 Z M270 372 q14 18 28 0 q-14 8 -28 0 Z M242 404 q14 18 28 0 q-14 8 -28 0 Z M186 404 q14 18 28 0 q-14 8 -28 0 Z M298 404 q14 18 28 0 q-14 8 -28 0 Z"/><circle cx="190" cy="238" r="34"/><circle cx="322" cy="238" r="34"/><circle fill="none" stroke="#fff" stroke-width="10" cx="190" cy="238" r="50"/><circle fill="none" stroke="#fff" stroke-width="10" cx="322" cy="238" r="50"/></svg>')
BRAND_LOGO = (
    '<img class="brand-mark" src="assets/carelink-owl-avatar-128.png" width="40" height="40" '
    'alt="Carelink" decoding="async">'
)
BRAND_LOGO_FOOT = (
    '<img class="brand-mark" src="assets/carelink-owl-avatar-128.png" width="40" height="40" '
    'alt="" aria-hidden="true" decoding="async">'
)

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


def build_structure_pane(ch):
    if not ch:
        return ''
    meta = BLOCKS_DATA.get(str(ch['num']), {})
    row = {'chapter': ch['num']}
    parts = ['<div class="chapter-pane-structure" hidden>']
    parts.append('<div class="struct-blocks">')
    for key, label in STRUCT_LABELS:
        filled = False
        if key == 'image':
            fig = ch.get('fig')
            src = resolve_chapter_image_src(ch['num'], meta.get('image') or '', fig)
            if src:
                im = chapter_image_meta(ch['num'])
                alt = (fig['alt'] if fig and fig.get('alt') else '') or im.get('alt', '')
                inner = f'<figure class="struct-fig">{img_picture(src, alt)}</figure>'
                filled = True
            else:
                inner = f'<p class="struct-placeholder">{PLACEHOLDER}</p>'
        else:
            text = (meta.get(key) or '').strip()
            if text:
                inner = f'<p>{inline(text)}</p>'
                filled = True
            else:
                inner = f'<p class="struct-placeholder">{PLACEHOLDER}</p>'
        row[key] = 'filled' if filled else 'placeholder'
        risk = ' struct-block--risk' if key == 'risks' and filled else ''
        parts.append(f'<section class="struct-block struct-block--{key}{risk}"><span class="mono struct-lbl">{label}</span>{inner}</section>')
    parts.append('</div></div>')
    blocks_report.append(row)
    return '\n'.join(parts)


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
    thumb = (
        f'<span class="chapter-card-thumb">{img_picture(src, alt, "chapter-card-thumb-img")}</span>'
        if src else ''
    )
    landing_items.append(
        f'<li><a class="chapter-card" href="#glava-{n}" data-chapter="{n}">'
        f'<span class="mono chapter-num">{n:02d}</span>{thumb}'
        f'<span class="chapter-card-text"><span class="chapter-card-title">{html.escape(ch["title"])}</span>'
        f'<span class="chapter-card-teaser">{html.escape(ch["teaser"])}</span></span></a></li>'
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
    problems = []
    for i, p in enumerate(d['problems'], 1):
        problems.append(
            f'<li class="challenge-item">'
            f'<span class="mono challenge-num">{i:02d}</span>'
            f'<div class="challenge-body">'
            f'<h3 class="challenge-title">{html.escape(p["title"])}</h3>'
            f'<p class="challenge-desc">{inline(p["description"])}</p>'
            f'<p class="challenge-response">'
            f'<span class="mono challenge-response-lbl">Ответ Carelink</span>'
            f'{inline(p["response"])}</p>'
            f'</div></li>'
        )
    examples = []
    for ex in d['examples']:
        examples.append(
            f'<aside class="challenge-example">'
            f'<span class="badge challenge-example-badge">Пример</span>'
            f'<h4 class="challenge-example-title">{html.escape(ex["title"])}</h4>'
            f'<p>{inline(ex["body"])}</p>'
            f'</aside>'
        )
    return (
        f'<section class="challenges" id="vyzovy" aria-labelledby="challenges-title">'
        f'<div class="challenges-in">'
        f'<span class="mono challenges-kicker">Проблемы семьи</span>'
        f'<h2 id="challenges-title" class="challenges-title">Вызовы</h2>'
        f'<p class="challenges-intro">{inline(d["intro"])}</p>'
        f'<ol class="challenge-list">{"".join(problems)}</ol>'
        f'<div class="challenge-examples">'
        f'<span class="mono challenges-examples-lbl">Сценарии</span>'
        f'<div class="challenge-examples-grid">{"".join(examples)}</div>'
        f'</div></div></section>'
    )


challenges_html = render_challenges_section()

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
<link rel="icon" href="assets/carelink-owl-avatar-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="assets/carelink-owl-avatar-128.png" type="image/png" sizes="128x128">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<a class="skip" href="#glava-1">К тексту</a>
<div class="progress" aria-hidden="true"><i id="bar"></i></div>
<header class="top">
  <a class="brand" href="#top">{BRAND_LOGO}<span class="bt"><b>Carelink</b><small>Спокойная забота</small></span></a>
  <nav class="top-nav mono" aria-label="Разделы"><a href="#vyzovy">Вызовы</a></nav>
  <span class="mono top-l">Манифест · живой лонгрид</span>
  <span class="mono top-r">{words} слов · {NUM_CHAPTERS} глав</span>
</header>
<main id="top">
<section class="hero">
  <div class="hero-in">
    <h1>{H1}</h1>
    <p class="stand">{inline(stand)}</p>
    <div class="chips">{meta_html}</div>
  </div>
  <figure class="hero-img"><img src="images/hero-family-table.jpg" alt="Вся семья за вечерним чаем"  width="1280" height="720"></figure>
</section>
<section class="chapter-index" aria-labelledby="chapter-index-title">
  <div class="chapter-index-in">
    <span class="mono chapter-index-kicker">Лендинг глав</span>
    <h2 id="chapter-index-title" class="chapter-index-title">{NUM_CHAPTERS} глав манифеста</h2>
    <ol class="chapter-landing">{landing_html}</ol>
  </div>
</section>
{challenges_html}
<div class="layout">
  <nav class="toc" aria-label="Оглавление"><span class="mono">Содержание</span><ol>{toc_html}<li><a href="#sources"><span class="mono">··</span>Об источниках</a></li></ol></nav>
  <article class="article read-stream">
    <div class="read-lead">{intro_html}</div>
    <div class="read-chapters">{chapter_html}</div>
    <div class="read-tail">{sources_html}</div>
  </article>
</div>
</main>
<dialog class="chapter-dialog" id="chapter-dialog" aria-labelledby="chapter-dialog-title">
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
  <a class="brand" href="#top">{BRAND_LOGO_FOOT}<span class="bt"><b>Carelink</b><small>Спокойная забота</small></span></a>
  <span class="mono">© 2026 Carelink · Слава Якимов</span>
  <span class="mono"><span class="badge">Концепт</span> — ещё обсуждается</span>
</footer>
<script src="assets/site.js" defer></script>
<script src="assets/chapters.js" defer></script>
</body>
</html>
'''
(ROOT / 'index.html').write_text(page, encoding='utf-8')
(ROOT / 'tools' / 'section-types.json').write_text(json.dumps(section_log, ensure_ascii=False, indent=2), encoding='utf-8')
(ROOT / 'tools' / 'chapter-blocks-report.json').write_text(json.dumps(blocks_report, ensure_ascii=False, indent=2), encoding='utf-8')
(ROOT / 'tools' / 'chapter-source-report.json').write_text(json.dumps(source_report, ensure_ascii=False, indent=2), encoding='utf-8')
print('ok words', words, 'chapters', len(toc), 'blocks', len(section_log), 'source_ok', all(r['match'] for r in source_report))
