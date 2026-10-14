#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicOut = path.join(root, 'web/public/site.json');
const stubOut = path.join(root, 'web/src/content/site.stub.json');

const r = spawnSync(
  'python3',
  ['tools/build.py', '--emit-json', publicOut, '--skip-html'],
  { cwd: root, stdio: 'inherit' },
);

if (r.status !== 0) {
  process.exit(r.status ?? 1);
}

const stub = {
  meta: {
    title: 'Carelink',
    stand: 'Запустите npm run compile:content',
    words: 0,
    numChapters: 0,
    h1Html: '',
    metaChipsHtml: '',
    ogImage: 'images/hero-family-table.jpg',
  },
  brandOwlHtml: '',
  sections: {
    challengesLegacy: '',
    chapterIndexLegacy: '',
    development: '',
    productArch: '',
    finaleLegacy: '',
  },
  article: { introHtml: '', chapterHtml: '', sourcesHtml: '' },
  landingCards: [],
  structured: {
    hero: { image: 'images/hero-family-table.jpg', imageAlt: '', tabs: [] },
    truth: { heading: '', body: '' },
    glossary: [],
    chaptersIntroNote: '',
    agenda: { intro_h2: '', intro_text: '', bundles: [] },
    chaptersLanding: { intro_h2: '', intro_text: '', chapters: [] },
    values: { title: '', items: [] },
    skills: { title: '', items: [] },
    development: {},
    productArch: {},
    challenges: {},
    article: { tocItems: [] },
  },
};

fs.writeFileSync(stubOut, `${JSON.stringify(stub, null, 2)}\n`, 'utf8');
