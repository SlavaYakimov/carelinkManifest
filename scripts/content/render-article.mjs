import { inline, firstSentence } from './inline.mjs';
import { imgPicture } from './picture.mjs';

const NUM_CHAPTERS = 20;
const PLACEHOLDER = 'Не сформулировано — требует подтверждения';

const ICON = {
  concept:
    '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2Zm-2 15v2h4v-2h-4Z"/></svg>',
  feature:
    '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"/></svg>',
  risk:
    '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z"/></svg>',
  sources:
    '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6Zm7 1.5L18.5 9H13V3.5ZM8 13h8v2H8v-2Zm0 4h8v2H8v-2Z"/></svg>',
};

const BLOCK_LABEL = {
  concept: 'Концепция',
  feature: 'Функция',
  risk: 'Риск',
  sources: 'Источники',
};

const H3_TYPE = {
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
};

const CHAPTER_DEFAULT = {
  0: 'feature',
  1: 'concept',
  2: 'concept',
  3: 'concept',
  4: 'concept',
  5: 'concept',
  6: 'feature',
  7: 'feature',
  8: 'concept',
  9: 'risk',
  10: 'feature',
  11: 'concept',
  12: 'concept',
  13: 'feature',
  14: 'concept',
  15: 'feature',
  16: 'concept',
  17: 'concept',
  18: 'concept',
  19: 'concept',
  20: 'feature',
};

const STRUCT_LABELS = [
  ['image', 'Картинка'],
  ['quote', 'Цитата'],
  ['mission', 'Миссия'],
  ['task', 'Задача'],
  ['hypothesis', 'Гипотеза'],
  ['risks', 'Риски'],
  ['description', 'Описание/объяснение'],
];

function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function classifyH3(title, chap) {
  if (H3_TYPE[title]) return H3_TYPE[title];
  const t = title.toLowerCase();
  if (t.includes('источник')) return 'sources';
  if (['защита', 'пауза', 'риск', 'предохран'].some((k) => t.includes(k))) return 'risk';
  if (['пульс', 'медиатор', 'sos'].some((k) => t.includes(k))) return 'feature';
  return CHAPTER_DEFAULT[chap] || 'concept';
}

function paragraphBlockType(text, chap) {
  const low = text.toLowerCase();
  if (low.includes('серьёзные риски')) {
    return ['risk', 'Серьёзные риски', 'Серьёзные риски (§8)'];
  }
  if (chap === 6 && low.includes('теневой дневник') && low.includes('концепт')) {
    return ['concept', 'Теневой дневник', 'Теневой дневник (§6)'];
  }
  return null;
}

function renderQuote(q) {
  const first = q[0] || '';
  if (first.startsWith('**Сценари')) {
    const lab = first.match(/\*\*(.+?)\*\*/)?.[1]?.replace(/\.$/, '') || 'Сценарий';
    const rest = [first.replace(/^\*\*.+?\*\*\s*/, ''), ...q.slice(1)];
    const rows = [];
    for (const r of rest) {
      if (!r) continue;
      let m = r.match(/^\*\*(.+?):\*\*\s*(.*)$/);
      if (m) {
        const who = m[1];
        const cls = who.startsWith('Carelink') ? 'bot' : 'hum';
        rows.push(
          `<p class="ln ${cls}"><span class="who mono">${inline(who)}</span><span class="say">${inline(m[2])}</span></p>`,
        );
      } else {
        m = r.match(/^\*\*(.+?)\*\*\s*(.*)$/);
        if (m && m[1].length < 30) {
          rows.push(
            `<p class="ln hum"><span class="who mono">${inline(m[1])}</span><span class="say">${inline(m[2])}</span></p>`,
          );
        } else {
          rows.push(`<p>${inline(r)}</p>`);
        }
      }
    }
    return `<aside class="vignette"><span class="mono lbl">◇ ${escAttr(lab)}</span>${rows.join('')}</aside>`;
  }
  if (first.startsWith('**Вопрос')) {
    const lab = first.match(/\*\*(.+?)\*\*/)?.[1]?.replace(/\.$/, '') || 'Вопрос';
    const rest = [first.replace(/^\*\*.+?\*\*\s*/, ''), ...q.slice(1)];
    const ps = rest.filter(Boolean).map((r) => `<p>${inline(r)}</p>`).join('');
    return `<aside class="question"><span class="mono lbl">? ${escAttr(lab)}</span>${ps}</aside>`;
  }
  if (first.startsWith('**')) {
    const lab = first.match(/\*\*(.+?)\*\*/)?.[1]?.replace(/\.$/, '') || '';
    const rest = [first.replace(/^\*\*.+?\*\*\s*/, ''), ...q.slice(1)];
    const ps = rest.filter(Boolean).map((r) => `<p>${inline(r)}</p>`).join('');
    return `<aside class="note"><span class="mono lbl">i · ${escAttr(lab)}</span>${ps}</aside>`;
  }
  let cite = '';
  let lines = [...q];
  if (lines.length > 1 && lines[lines.length - 1].startsWith('—')) {
    cite = `<cite class="mono">${inline(lines.pop())}</cite>`;
  }
  return `<blockquote class="pull"><p>${inline(lines.join(' '))}</p>${cite}</blockquote>`;
}

function resolveChapterImageSrc(num, metaSrc, illustration, chapterImages) {
  let src = (metaSrc || '').trim();
  if (!src || src === 'auto') {
    if (illustration?.src) src = illustration.src;
    else src = chapterImages[String(num)]?.src || '';
  }
  return src.split('?')[0];
}

function renderStructBlocks(meta, ch, chapterImages, variant = 'v2') {
  const parts = [`<div class="struct-blocks struct-blocks--${variant}">`];
  for (const [key, label] of STRUCT_LABELS) {
    let inner;
    if (key === 'image') {
      const src = resolveChapterImageSrc(ch.num, meta.image, ch.illustration, chapterImages);
      if (src) {
        const alt =
          ch.illustration?.alt ||
          chapterImages[String(ch.num)]?.alt ||
          ch.title ||
          '';
        inner = `<figure class="struct-fig">${imgPicture(src, alt, '', ch.num)}</figure>`;
      } else {
        inner = `<p class="struct-placeholder">${PLACEHOLDER}</p>`;
      }
    } else {
      const text = (meta[key] || '').trim();
      if (text) {
        const paras = text.split(/\n\n+/).filter((p) => p.trim());
        inner = paras.map((p) => `<p>${inline(p.trim())}</p>`).join('');
      } else {
        inner = `<p class="struct-placeholder">${PLACEHOLDER}</p>`;
      }
    }
    const risk =
      key === 'risks' && (meta.risks || '').trim() ? ' struct-block--risk' : '';
    parts.push(
      `<section class="struct-block struct-block--${key}${risk}">` +
        `<span class="mono struct-lbl">${label}</span>${inner}</section>`,
    );
  }
  parts.push('</div>');
  return parts.join('');
}

function renderV1Prose(mdText) {
  const parts = ['<div class="chapter-v1-prose">'];
  if (!mdText?.trim()) {
    parts.push(`<p class="struct-placeholder">${PLACEHOLDER}</p>`);
  } else {
    for (const block of mdText.trim().split(/\n\n+/)) {
      const b = block.trim();
      if (!b || b.startsWith('![') || b.startsWith('*Иллюстрация')) continue;
      if (b.startsWith('### ')) {
        parts.push(`<h3 class="chapter-v1-h3">${inline(b.slice(4).trim())}</h3>`);
        continue;
      }
      if (b.startsWith('>')) {
        const lines = b
          .split('\n')
          .map((ln) => ln.trim())
          .filter((ln) => ln.startsWith('>'))
          .map((ln) => ln.slice(1).trim());
        parts.push(
          `<blockquote class="chapter-v1-quote"><p>${inline(lines.join(' '))}</p></blockquote>`,
        );
        continue;
      }
      const flat = b.replace(/\n/g, ' ');
      parts.push(`<p>${inline(flat)}</p>`);
    }
  }
  parts.push('</div>');
  return parts.join('');
}

function buildStructurePane(ch, chapterImages) {
  const n = ch.num;
  const tabBtns = [];
  const panels = [];
  const defs = [[1, 'Версия 1'], [2, 'Версия 2'], [3, 'Версия 3']];
  for (const [vnum, vlabel] of defs) {
    const defaultTab = vnum === 3;
    tabBtns.push(
      `<button type="button" role="tab" class="chapter-version-tab" ` +
        `id="chapter-${n}-version-tab-${vnum}" data-version-tab="${vnum}" ` +
        `aria-selected="${defaultTab ? 'true' : 'false'}" ` +
        `aria-controls="chapter-${n}-version-panel-${vnum}" tabindex="${defaultTab ? 0 : -1}">` +
        `${vlabel}</button>`,
    );
    let inner;
    if (vnum === 1) {
      inner = renderV1Prose(ch.v1Markdown);
    } else if (vnum === 2) {
      inner = renderStructBlocks(ch.structure || {}, ch, chapterImages, 'v2');
    } else {
      inner = renderStructBlocks(ch.structureV3 || ch.structure || {}, ch, chapterImages, 'v3');
    }
    const hidden = defaultTab ? '' : ' hidden';
    panels.push(
      `<div role="tabpanel" class="chapter-version-panel chapter-version-panel--v${vnum}" ` +
        `id="chapter-${n}-version-panel-${vnum}" data-version-panel="${vnum}" ` +
        `aria-labelledby="chapter-${n}-version-tab-${vnum}"${hidden}>${inner}</div>`,
    );
  }
  return (
    `<div class="chapter-pane-structure" data-chapter-versions="${n}">` +
    `<div role="tablist" class="chapter-version-tablist" aria-label="Версии структуры">` +
    `${tabBtns.join('')}</div>${panels.join('')}</div>`
  );
}

function renderBlockContent(b, ctx) {
  if (b.kind === 'paragraph') {
    if (ctx.active === 'chapter' && ctx.curCh && !ctx.curCh.teaser) {
      ctx.curCh.teaser = firstSentence(b.text);
    }
    return `<p>${inline(b.text)}</p>`;
  }
  if (b.kind === 'list') {
    const tag = b.ordered ? 'ol' : 'ul';
    const items = (b.items || []).map((x) => `<li>${inline(x)}</li>`).join('');
    return `<${tag}>${items}</${tag}>`;
  }
  if (b.kind === 'quote') {
    return renderQuote(b.lines || []);
  }
  if (b.kind === 'reader_question') {
    return renderQuote(['**Вопрос читателю.** ' + (b.text || '')]);
  }
  if (b.kind === 'scenario') {
    return renderQuote(['**Сценарий. Вымышленный пример.**', ...(b.text || '').split('\n')]);
  }
  if (b.kind === 'figure') {
    const { alt, src, caption } = b;
    const num = caption?.num || '';
    const rest = caption?.text || '';
    if (ctx.active === 'chapter' && ctx.curCh && !ctx.curCh.fig) {
      ctx.curCh.fig = { src, alt };
    }
    return (
      `<figure class="ill">${imgPicture(src, alt)}` +
      `<figcaption><span class="mono">${inline(num)}</span><span>${inline(rest)}</span></figcaption></figure>`
    );
  }
  return '';
}

function createRenderer() {
  let blockOpen = false;
  let blockHeading = null;
  let pendingMarker = null;
  let chap = 0;
  let active = 'intro';
  let curCh = null;
  const introLines = [];
  const sourcesLines = [];
  const chapterParts = [];
  const toc = [];

  function emit(line) {
    if (active === 'intro') introLines.push(line);
    else if (active === 'chapter' && curCh) curCh.lines.push(line);
    else sourcesLines.push(line);
  }

  function closeBlock() {
    if (blockOpen) {
      emit('</div></section>');
      blockOpen = false;
      blockHeading = null;
    }
  }

  function openBlock(btype, heading = null, logKey = null, blockId = null) {
    closeBlock();
    const lab = BLOCK_LABEL[btype];
    const ico = ICON[btype];
    const h = heading ? `<h3 class="block-title">${inline(heading)}</h3>` : '';
    const idAttr = blockId ? ` id="${blockId}"` : '';
    const extra = btype === 'sources' ? ' sources' : '';
    emit(
      `<section class="block block--${btype}${extra}"${idAttr}>` +
        `<header class="block-h"><span class="block-ico">${ico}</span><span class="mono block-lbl">${lab}</span>${h}</header>` +
        `<div class="block-body">`,
    );
    blockOpen = true;
    blockHeading = heading;
  }

  function ensureBlock(btype, heading = null, logKey = null) {
    if (!blockOpen || (heading && blockHeading !== heading)) {
      openBlock(btype, heading, logKey, heading === 'Об источниках' ? 'sources' : null);
    }
  }

  function finishChapter() {
    if (!curCh) return;
    emit('</div>');
    emit(buildStructurePane(curCh, curCh._chapterImages));
    emit('</section>');
    chapterParts.push(curCh);
    curCh = null;
  }

  function processBlocks(blocks, mode) {
    active = mode;
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (b.kind === 'marker') {
        pendingMarker = b.blockType;
        continue;
      }
      if (b.kind === 'heading' && b.level === 3 && b.text === 'Об источниках') {
        closeBlock();
        active = 'sources';
        openBlock('sources', 'Об источниках', 'Об источниках', 'sources');
        pendingMarker = null;
        continue;
      }
      if (b.kind === 'heading' && b.level === 3) {
        const btype =
          pendingMarker && BLOCK_LABEL[pendingMarker]
            ? pendingMarker
            : classifyH3(b.text, chap);
        pendingMarker = null;
        openBlock(btype, b.text, b.text);
        continue;
      }
      if (b.kind === 'heading' && b.level === 4) {
        ensureBlock(CHAPTER_DEFAULT[chap] || 'concept');
        emit(`<h4 class="block-sub">${inline(b.text)}</h4>`);
        continue;
      }
      if (b.kind === 'hr') {
        closeBlock();
        pendingMarker = null;
        continue;
      }
      if (b.kind === 'paragraph') {
        const ptype = paragraphBlockType(b.text, chap);
        if (ptype) {
          openBlock(ptype[0], ptype[1], ptype[2]);
        } else if (!blockOpen) {
          const defaultType =
            pendingMarker && BLOCK_LABEL[pendingMarker]
              ? pendingMarker
              : CHAPTER_DEFAULT[chap] || 'feature';
          pendingMarker = null;
          const logKey = chap ? `Глава ${String(chap).padStart(2, '0')}` : 'Вступление';
          openBlock(defaultType, null, logKey);
        }
        emit(renderBlockContent(b, { active, curCh }));
        continue;
      }
      if (['list', 'quote', 'reader_question', 'scenario', 'figure'].includes(b.kind)) {
        if (!blockOpen) ensureBlock(CHAPTER_DEFAULT[chap] || 'concept');
        emit(renderBlockContent(b, { active, curCh }));
      }
    }
    closeBlock();
  }

  function renderChapter(ch, chapterImages) {
    finishChapter();
    chap = ch.num;
    active = 'chapter';
    const sid = `glava-${ch.num}`;
    toc.push({ n: ch.num, title: ch.title });
    curCh = {
      num: ch.num,
      title: ch.title,
      teaser: ch.lead ? firstSentence(ch.lead) : null,
      lines: [],
      fig: ch.illustration ? { src: ch.illustration.src, alt: ch.illustration.alt } : null,
      structure: ch.structure,
      structureV3: ch.structureV3,
      v1Markdown: ch.v1Markdown,
      _chapterImages: chapterImages,
    };
    emit(
      `<section class="chapter" id="${sid}" data-chapter="${ch.num}" tabindex="-1">` +
        `<header class="ch-h"><span class="mono">Глава ${String(ch.num).padStart(2, '0')} / ${NUM_CHAPTERS}</span>` +
        `<h2>${inline(ch.title)}</h2></header><div class="chapter-pane-source">`,
    );
    if (ch.lead) {
      emit(`<p class="chapter-lead"><em>${inline(ch.lead)}</em></p>`);
    }
    if (ch.illustration) {
      const { src, alt, caption } = ch.illustration;
      emit(
        `<figure class="ill">${imgPicture(src, alt, '', ch.num)}` +
          `<figcaption><span class="mono">${inline(caption?.num || '')}</span>` +
          `<span>${inline(caption?.text || '')}</span></figcaption></figure>`,
      );
    }
    processBlocks(ch.blocks || [], 'chapter');
    finishChapter();
  }

  return {
    renderIntro(blocks) {
      active = 'intro';
      chap = 0;
      processBlocks(blocks, 'intro');
      return introLines.join('\n');
    },
    renderSources(blocks) {
      active = 'sources';
      processBlocks(blocks, 'sources');
      return sourcesLines.join('\n');
    },
    renderChapter,
    getChapterHtml() {
      return chapterParts.map((c) => c.lines.join('\n')).join('\n');
    },
    getToc() {
      return toc;
    },
  };
}

export function renderArticle(article, chapterImages) {
  const r = createRenderer();
  const introHtml = r.renderIntro(article.intro.blocks || []);
  for (const ch of article.chapters) {
    r.renderChapter(ch, chapterImages);
  }
  const sourcesHtml = r.renderSources(article.sources.blocks || []);
  return {
    introHtml,
    chapterHtml: r.getChapterHtml(),
    sourcesHtml,
    tocItems: r.getToc(),
  };
}

const WORD_RE = /[A-Za-z\u0400-\u04FF0-9_]+/g;

function textFromBlocks(blocks) {
  const parts = [];
  for (const b of blocks || []) {
    if (b.text) parts.push(b.text);
    if (b.lines) parts.push(...b.lines);
    if (b.items) parts.push(...b.items);
  }
  return parts.join(' ');
}

function textFromStructure(obj) {
  if (!obj || typeof obj !== 'object') return '';
  return Object.values(obj).filter((v) => typeof v === 'string').join(' ');
}

export function countWords(article) {
  const chunks = [
    textFromBlocks(article.intro?.blocks),
    textFromBlocks(article.sources?.blocks),
    article.finale?.markdown || '',
  ];
  for (const ch of article.chapters || []) {
    chunks.push(ch.title || '', ch.lead || '', ch.v1Markdown || '');
    chunks.push(textFromStructure(ch.structure), textFromStructure(ch.structureV3));
    chunks.push(textFromBlocks(ch.blocks));
  }
  return chunks.join(' ').match(WORD_RE)?.length || 0;
}

export function buildMetaHtml(meta) {
  const t1 = meta.title.split(': ')[0];
  const t2 = meta.title.includes(': ') ? meta.title.split(': ').slice(1).join(': ') : '';
  const h1Html = t2
    ? `<span>${escAttr(t1)}</span> <span class="thin">${escAttr(t2)}</span>`
    : `<span>${escAttr(t1)}</span>`;
  const metaChipsHtml = (meta.chips || [])
    .map((m) => `<span class="chip mono">${escAttr(m)}</span>`)
    .join('');
  return { h1Html, metaChipsHtml };
}
