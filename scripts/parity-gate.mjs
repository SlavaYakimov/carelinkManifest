#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitePath = path.join(root, 'web/public/site.json');
const site = JSON.parse(fs.readFileSync(sitePath, 'utf8'));

const errors = [];
const { meta, sections, article, landingCards, structured } = site;

if (!meta.numChapters || meta.numChapters < 1) errors.push('meta.numChapters missing');
if (!meta.words || meta.words < 1000) errors.push('meta.words too low');
if (!sections.development?.length) errors.push('sections.development missing');
if (!sections.productArch?.length) errors.push('sections.productArch missing');
if (!article.chapterHtml?.includes('id="glava-')) errors.push('chapter HTML missing');
if (!landingCards?.length) errors.push('landingCards empty');
if (!structured?.agenda?.bundles?.length) errors.push('structured.agenda missing');
if (structured?.agenda?.bundles?.length !== 9) {
  errors.push(`structured.agenda bundles: expected 9, got ${structured?.agenda?.bundles?.length}`);
}
if (!structured?.article?.tocItems?.length) errors.push('structured.article.tocItems missing');

if (errors.length) {
  console.error('parity-gate failed:\n', errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(
  'parity-gate ok:',
  meta.words,
  'words',
  meta.numChapters,
  'chapters',
  landingCards.length,
  'landing cards',
);
