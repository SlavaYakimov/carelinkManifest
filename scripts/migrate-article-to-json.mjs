#!/usr/bin/env node
/**
 * Optional: external ARTICLE.md → content/blocks/article/*.json
 * (not in repo; штатная правка — JSON в content/blocks/article/)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articleDir = path.join(root, 'content/blocks/article');
const chaptersDir = path.join(articleDir, 'chapters');
const mdPath = path.join(root, 'ARTICLE.md');
if (!fs.existsSync(mdPath)) {
  console.error('migrate-article: положите ARTICLE.md в корень репозитория (в репо источник — content/blocks/article/)');
  process.exit(1);
}

const FINALE_MARKER = '<!-- landing:finale -->';
const blocksDir = path.join(root, 'content/blocks');
const chapterBlocks = JSON.parse(
  fs.readFileSync(path.join(blocksDir, 'chapter-blocks.json'), 'utf8'),
);
const chapterImages = JSON.parse(
  fs.readFileSync(path.join(blocksDir, 'chapter-images.json'), 'utf8'),
);

function parseBlocks(lines) {
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    const marker = l.trim().match(/^<!--\s*block:(\w+)\s*-->$/);
    if (marker) {
      blocks.push({ kind: 'marker', blockType: marker[1] });
      i += 1;
      continue;
    }
    if (l.startsWith('>')) {
      const linesQ = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        linesQ.push(lines[i].slice(1).trim());
        i += 1;
      }
      if (linesQ[0]?.includes('Сценарий') && linesQ[0].includes('Вымышленный')) {
        blocks.push({ kind: 'scenario', text: linesQ.slice(1).join('\n') });
      } else if (linesQ[0]?.includes('Вопрос читателю')) {
        blocks.push({
          kind: 'reader_question',
          text: linesQ[0].replace(/\*\*Вопрос читателю\.\*\*\s*/, '').trim(),
        });
      } else {
        blocks.push({ kind: 'quote', lines: linesQ });
      }
      continue;
    }
    if (l.startsWith('![')) {
      const m = l.match(/!\[(.*?)\]\((.*?)\)/);
      let cap = '';
      if (i + 1 < lines.length && lines[i + 1].startsWith('*')) {
        cap = lines[i + 1].replace(/^\*|\*$/g, '');
        i += 1;
      }
      const [num, ...rest] = cap.split(' · ');
      blocks.push({
        kind: 'figure',
        alt: m?.[1] || '',
        src: m?.[2] || '',
        caption: { num: num || '', text: rest.join(' · ') },
      });
      i += 1;
      continue;
    }
    if (/^(- |\d+\. )/.test(l)) {
      const ordered = /^\d+\. /.test(l);
      const items = [];
      while (i < lines.length && /^(- |\d+\. )/.test(lines[i])) {
        items.push(lines[i].replace(/^(- |\d+\. )/, ''));
        i += 1;
      }
      blocks.push({ kind: 'list', ordered, items });
      continue;
    }
    if (l.startsWith('#')) {
      const hashes = l.match(/^#+/)[0].length;
      blocks.push({ kind: 'heading', level: hashes, text: l.slice(hashes).trim() });
      i += 1;
      continue;
    }
    if (l.trim() === '---') {
      blocks.push({ kind: 'hr' });
      i += 1;
      continue;
    }
    if (l.trim()) {
      if (l.trim().startsWith('*') && l.trim().endsWith('*') && !l.trim().startsWith('**')) {
        blocks.push({ kind: 'lead', text: l.trim().replace(/^\*|\*$/g, '') });
      } else {
        blocks.push({ kind: 'paragraph', text: l.trim() });
      }
    }
    i += 1;
  }
  return blocks;
}

let raw = fs.readFileSync(mdPath, 'utf8');
let finaleChunk = '';
if (raw.includes(FINALE_MARKER)) {
  const [head, tail] = raw.split(FINALE_MARKER);
  const [fin, sourcesRest] = tail.split('### Об источниках');
  finaleChunk = fin;
  raw = head + '### Об источниках' + sourcesRest;
}

const allLines = raw.split('\n');
const blocks = parseBlocks(allLines);
const title = blocks.find((b) => b.kind === 'heading' && b.level === 1)?.text || '';
const stand = blocks[1]?.kind === 'heading' && blocks[1].level === 3 ? blocks[1].text : blocks.find((b) => b.kind === 'heading' && b.level === 3)?.text;
const metaLine = blocks.find((b) => b.kind === 'paragraph' && b.text.includes('`'))?.text || '';
const chips = [...metaLine.matchAll(/`([^`]+)`/g)].map((m) => m[1]);

let bodyStart = 0;
for (let i = 0; i < blocks.length; i++) {
  if (blocks[i].kind === 'heading' && blocks[i].level === 2 && /^\d+\./.test(blocks[i].text)) {
    bodyStart = i;
    break;
  }
}
const introBlocks = blocks.slice(3, bodyStart).filter((b) => b.kind !== 'hr');
const bodyBlocks = blocks.slice(bodyStart);

const chapters = [];
let i = 0;
let sourcesBlocks = [];
while (i < bodyBlocks.length) {
  const b = bodyBlocks[i];
  if (b.kind === 'heading' && b.level === 2) {
    const m = b.text.match(/^(\d+)\.\s*(.+)/);
    if (!m) {
      i += 1;
      continue;
    }
    const num = parseInt(m[1], 10);
    const titleCh = m[2];
    i += 1;
    const chBlocks = [];
    let illustration = null;
    let lead = null;
    while (i < bodyBlocks.length) {
      const nb = bodyBlocks[i];
      if (nb.kind === 'heading' && nb.level === 2) break;
      if (nb.kind === 'heading' && nb.level === 3 && nb.text === 'Об источниках') {
        i += 1;
        while (i < bodyBlocks.length) {
          sourcesBlocks.push(bodyBlocks[i]);
          i += 1;
        }
        break;
      }
      if (nb.kind === 'figure' && !illustration) {
        illustration = {
          src: nb.src,
          alt: nb.alt,
          caption: nb.caption,
        };
        i += 1;
        continue;
      }
      if (nb.kind === 'lead' && !lead) {
        lead = nb.text;
        i += 1;
        continue;
      }
      chBlocks.push(nb);
      i += 1;
    }
    const structure = chapterBlocks[String(num)] || {};
    const im = chapterImages[String(num)] || {};
    if (!illustration && im.src) {
      illustration = {
        src: im.src,
        alt: im.alt || titleCh,
        caption: { num: '', text: im.caption || '' },
      };
    }
    chapters.push({
      num,
      title: titleCh,
      illustration,
      lead,
      structure,
      structureV3: structure,
      v1Markdown: '',
      blocks: chBlocks,
    });
    continue;
  }
  i += 1;
}

fs.mkdirSync(chaptersDir, { recursive: true });
fs.writeFileSync(
  path.join(articleDir, 'intro.json'),
  `${JSON.stringify({ blocks: introBlocks }, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(articleDir, 'sources.json'),
  `${JSON.stringify({ blocks: sourcesBlocks }, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(articleDir, 'finale.json'),
  `${JSON.stringify({ markdown: finaleChunk.trim() }, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(articleDir, 'manifest.json'),
  `${JSON.stringify(
    {
      numChapters: chapters.length,
      chapterFiles: chapters.map((c) => `chapters/${String(c.num).padStart(2, '0')}.json`),
    },
    null,
    2,
  )}\n`,
);

for (const ch of chapters) {
  const file = path.join(chaptersDir, `${String(ch.num).padStart(2, '0')}.json`);
  const { structureV3, ...rest } = ch;
  const out = { ...rest, structureV3 };
  fs.writeFileSync(file, `${JSON.stringify(out, null, 2)}\n`);
}

console.log(
  'migrate-article:',
  chapters.length,
  'chapters, intro blocks',
  introBlocks.length,
  'sources blocks',
  sourcesBlocks.length,
);
