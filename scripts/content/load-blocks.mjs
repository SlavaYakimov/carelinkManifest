import fs from 'node:fs';
import path from 'node:path';

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function loadBlocks(root) {
  const blocksDir = path.join(root, 'content/blocks');
  const read = (name) => readJson(path.join(blocksDir, name));

  const articleDir = path.join(blocksDir, 'article');
  const manifest = readJson(path.join(articleDir, 'manifest.json'));
  const intro = readJson(path.join(articleDir, 'intro.json'));
  const sources = readJson(path.join(articleDir, 'sources.json'));
  const finale = fs.existsSync(path.join(articleDir, 'finale.json'))
    ? readJson(path.join(articleDir, 'finale.json'))
    : { markdown: '' };

  const chapters = manifest.chapterFiles.map((rel) =>
    readJson(path.join(articleDir, rel)),
  );

  let chapterImages = {};
  const imgPath = path.join(root, 'tools/chapter-images.json');
  if (fs.existsSync(imgPath)) {
    chapterImages = readJson(imgPath);
  }

  return {
    meta: read('meta.json'),
    hero: read('hero.json'),
    editorial: read('editorial.json'),
    agenda: read('agenda.json'),
    chaptersLanding: read('chapters-landing.json'),
    values: read('values.json'),
    skills: read('skills.json'),
    development: read('development.json'),
    productArch: read('product-arch.json'),
    challenges: read('challenges.json'),
    finaleCtas: read('finale-ctas.json'),
    landingCards: read('landing-cards.json'),
    article: { intro, sources, finale, chapters, manifest },
    chapterImages,
  };
}
