import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBlocks } from './load-blocks.mjs';
import { buildMetaHtml, countWords, renderArticle } from './render-article.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const BRAND_OWL =
  '<span class="owl"><img src="assets/carelink-owl-avatar.svg" alt="" width="40" height="45" class="owl-mark" decoding="async" loading="lazy" aria-hidden="true" role="presentation"></span>';

function buildStub() {
  return {
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
      development: { intro: '', done: [], in_progress: [] },
      productArch: { intro: '', items: [] },
      challenges: { intro: '', problems: [], examples: [] },
      article: { tocItems: [] },
      finaleCtas: { lead: '', ctas: [] },
    },
  };
}

export function compileSite() {
  const blocks = loadBlocks(root);
  const articleRendered = renderArticle(blocks.article, blocks.chapterImages);
  const { h1Html, metaChipsHtml } = buildMetaHtml(blocks.meta);
  const numChapters = blocks.article.manifest.numChapters || blocks.article.chapters.length;

  const sitePayload = {
    meta: {
      title: blocks.meta.title,
      stand: blocks.meta.stand,
      words: countWords(blocks.article),
      numChapters,
      h1Html,
      metaChipsHtml,
      ogImage: blocks.meta.ogImage || 'images/hero-family-table.jpg',
    },
    brandOwlHtml: BRAND_OWL,
    article: {
      introHtml: articleRendered.introHtml,
      chapterHtml: articleRendered.chapterHtml,
      sourcesHtml: articleRendered.sourcesHtml,
    },
    landingCards: blocks.landingCards,
    structured: {
      hero: blocks.hero,
      truth: blocks.editorial.truth_layer,
      glossary: blocks.editorial.glossary,
      chaptersIntroNote: blocks.editorial.chapters_intro_note || '',
      agenda: blocks.agenda,
      chaptersLanding: blocks.chaptersLanding,
      values: blocks.values,
      skills: blocks.skills,
      development: blocks.development,
      productArch: blocks.productArch,
      challenges: blocks.challenges,
      finaleCtas: blocks.finaleCtas,
      article: { tocItems: articleRendered.tocItems },
    },
  };

  const publicOut = path.join(root, 'web/public/site.json');
  const stubOut = path.join(root, 'web/src/content/site.stub.json');
  fs.mkdirSync(path.dirname(publicOut), { recursive: true });
  fs.writeFileSync(publicOut, `${JSON.stringify(sitePayload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(stubOut, `${JSON.stringify(buildStub(), null, 2)}\n`, 'utf8');
  console.log(
    'compile-site:',
    sitePayload.meta.words,
    'words',
    numChapters,
    'chapters',
    sitePayload.landingCards.length,
    'landing cards',
  );
  return sitePayload;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  compileSite();
}
