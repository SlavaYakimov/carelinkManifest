#!/usr/bin/env node
import fs from 'fs';

const bundleHtml = fs.readFileSync('/workspace/reference/figma-make/snippets/bundleScroll.txt', 'utf8');
const chapterHtml = fs.readFileSync('/workspace/reference/figma-make/snippets/chaptersScroll.txt', 'utf8');

const miniRe =
  /<article class="bundle-mini">[\s\S]*?src="([^"]+)"[\s\S]*?<p>([^<]+)<\/p><h3>([^<]+)<\/h3>/g;
const minis = [];
let m;
while ((m = miniRe.exec(bundleHtml))) {
  minis.push({ src: m[1].replace(/^\//, ''), label: m[2], title: m[3] });
}

const agenda = JSON.parse(fs.readFileSync('/workspace/tools/agenda-bundles.json', 'utf8'));
let idx = 0;
for (const b of agenda.bundles) {
  for (const key of ['vyzov', 'scenario', 'reshenie']) {
    const item = b[key];
    const fig = minis[idx++];
    if (!fig) break;
    item.image = fig.src;
    item.label = fig.label;
    item.title = fig.title;
  }
}
fs.writeFileSync('/workspace/tools/agenda-bundles.json', JSON.stringify(agenda, null, 2) + '\n');

const chRe =
  /<article class="chapter-card"[\s\S]*?src="([^"]+)"[\s\S]*?<p>([^<]+)<\/p><h3>([^<]+)<\/h3><span>([^<]+)<\/span>/g;
const chapters = [];
while ((m = chRe.exec(chapterHtml))) {
  chapters.push({
    image: m[1].replace(/^\//, ''),
    label: m[2],
    title: m[3],
    subtitle: m[4],
  });
}

const chJson = JSON.parse(fs.readFileSync('/workspace/tools/manifesto-chapters-landing.json', 'utf8'));
chJson.chapters.forEach((ch, i) => {
  const fig = chapters[i];
  if (!fig) return;
  ch.image = fig.image;
  ch.title = fig.title;
  ch.subtitle = fig.subtitle;
});
fs.writeFileSync('/workspace/tools/manifesto-chapters-landing.json', JSON.stringify(chJson, null, 2) + '\n');

console.log('minis', minis.length, 'chapters', chapters.length);
