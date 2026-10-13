#!/usr/bin/env python3
"""ARTICLE.md -> index.html (без внешних зависимостей). Запуск: python3 tools/build.py"""
import re, html, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
md = (ROOT / 'ARTICLE.md').read_text(encoding='utf-8')

OWL = ('<svg viewBox="0 0 512 512" width="24" height="24" fill="#fff" aria-hidden="true"><path fill-rule="evenodd" d="M132 60 L196 132 Q256 116 316 132 L380 60 L392 168 Q440 226 440 300 Q440 410 352 456 Q306 480 256 480 Q206 480 160 456 Q72 410 72 300 Q72 226 120 168 Z M190 168 a70 70 0 1 0 0.1 0 Z M322 168 a70 70 0 1 0 0.1 0 Z M256 270 L238 300 L256 336 L274 300 Z M214 372 q14 18 28 0 q-14 8 -28 0 Z M270 372 q14 18 28 0 q-14 8 -28 0 Z M242 404 q14 18 28 0 q-14 8 -28 0 Z M186 404 q14 18 28 0 q-14 8 -28 0 Z M298 404 q14 18 28 0 q-14 8 -28 0 Z"/><circle cx="190" cy="238" r="34"/><circle cx="322" cy="238" r="34"/><circle fill="none" stroke="#fff" stroke-width="10" cx="190" cy="238" r="50"/><circle fill="none" stroke="#fff" stroke-width="10" cx="322" cy="238" r="50"/></svg>')

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

blocks, cur = [], []
lines = md.split('\n')
i = 0
while i < len(lines):
    l = lines[i]
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

# hero
title = blocks[0][2]; stand = blocks[1][2]; meta = re.findall(r'`([^`]+)`', blocks[2][1])
body = blocks[3:]
toc, out, sec_open, chap = [], [], False, 0

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

for b in body:
    k = b[0]
    if k == 'h' and b[1] == 2:
        if sec_open: out.append('</section>')
        m = re.match(r'(\d+)\.\s*(.+)', b[2]); chap = int(m.group(1)); name = m.group(2)
        sid = f'ch{chap:02d}'; toc.append((sid, chap, name))
        out.append(f'<section class="chapter" id="{sid}"><header class="ch-h"><span class="mono">Глава {chap:02d} / 13</span><h2>{inline(name)}</h2></header>')
        sec_open = True
    elif k == 'h' and b[1] == 3 and b[2] == 'Об источниках':
        if sec_open: out.append('</section>'); sec_open = False
        out.append('<section class="sources" id="sources"><span class="mono">Методология</span><h3>Об источниках</h3>')
        sec_open = True
    elif k == 'h':
        out.append(f'<h3>{inline(b[2])}</h3>')
    elif k == 'p':
        out.append(f'<p>{inline(b[1])}</p>')
    elif k == 'list':
        tag = 'ol' if b[1] else 'ul'
        out.append(f'<{tag}>' + ''.join(f'<li>{inline(x)}</li>' for x in b[2]) + f'</{tag}>')
    elif k == 'quote':
        out.append(render_quote(b[1]))
    elif k == 'fig':
        _, alt, src, cap = b
        num, _, rest = cap.partition(' · ')
        out.append(f'<figure class="ill"><img src="{src}" alt="{html.escape(alt)}" loading="lazy" decoding="async" width="1280" height="720"><figcaption><span class="mono">{inline(num)}</span><span>{inline(rest)}</span></figcaption></figure>')
    elif k == 'hr':
        pass
if sec_open: out.append('</section>')

toc_html = ''.join(f'<li><a href="#{sid}"><span class="mono">{n:02d}</span>{html.escape(name)}</a></li>' for sid, n, name in toc)
meta_html = ''.join(f'<span class="chip mono">{html.escape(m)}</span>' for m in meta)
t1, _, t2 = title.partition(': ')
H1 = (f'<span>{html.escape(t1)}</span> <span class="thin">{html.escape(t2)}</span>' if t2 else f'<span>{html.escape(t1)}</span>')
words = len(re.findall(r'[\wёЁ-]+', re.sub(r'[`*#>!\[\]()]', ' ', md)))

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
<link rel="icon" href="assets/owl.svg" type="image/svg+xml">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<a class="skip" href="#ch01">К тексту</a>
<div class="progress" aria-hidden="true"><i id="bar"></i></div>
<header class="top">
  <a class="brand" href="#top" aria-label="Carelink"><span class="owl">{OWL}</span><span class="bt"><b>Carelink</b><small>Спокойная забота</small></span></a>
  <span class="mono top-l">Манифест · живой лонгрид</span>
  <span class="mono top-r">{words} слов · 13 глав</span>
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
<div class="layout">
  <nav class="toc" aria-label="Оглавление"><span class="mono">Содержание</span><ol>{toc_html}<li><a href="#sources"><span class="mono">··</span>Об источниках</a></li></ol></nav>
  <article class="article">
{chr(10).join(out)}
  </article>
</div>
</main>
<footer class="foot">
  <a class="brand" href="#top"><span class="owl">{OWL}</span><span class="bt"><b>Carelink</b><small>Спокойная забота</small></span></a>
  <span class="mono">© 2026 Carelink · Слава Якимов</span>
  <span class="mono"><span class="badge">Концепт</span> — ещё обсуждается</span>
</footer>
<script>
(function(){{var b=document.getElementById('bar');function u(){{var h=document.documentElement;b.style.width=(100*h.scrollTop/((h.scrollHeight-h.clientHeight)||1))+'%'}}addEventListener('scroll',u,{{passive:true}});u();
var links=[].slice.call(document.querySelectorAll('.toc a'));var io=new IntersectionObserver(function(es){{es.forEach(function(e){{if(e.isIntersecting){{links.forEach(function(a){{a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)}})}}}})}},{{rootMargin:'-40% 0px -55% 0px'}});document.querySelectorAll('.chapter,.sources').forEach(function(s){{io.observe(s)}});}})();
</script>
</body>
</html>
'''
(ROOT / 'index.html').write_text(page, encoding='utf-8')
print('ok words', words, 'chapters', len(toc))
