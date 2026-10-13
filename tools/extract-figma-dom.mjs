#!/usr/bin/env node
import { chromium } from '/tmp/node_modules/playwright/index.mjs';
import fs from 'fs';

const url = 'https://ribbon-rake-92617748.figma.site/';
const out = '/workspace/reference/figma-make/dom-outline.json';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
await page.waitForTimeout(2000);

const outline = await page.evaluate(() => {
  function walk(el, depth = 0) {
    if (depth > 8 || !el || el.nodeType !== 1) return null;
    const tag = el.tagName.toLowerCase();
    const cls = el.className && typeof el.className === 'string' ? el.className.trim().slice(0, 120) : '';
    const id = el.id || '';
    const text =
      el.childNodes.length === 1 && el.childNodes[0].nodeType === 3
        ? el.textContent.trim().slice(0, 80)
        : '';
    const kids = [];
    for (const c of el.children) {
      const w = walk(c, depth + 1);
      if (w) kids.push(w);
    }
    if (!cls && !id && !text && kids.length === 0 && depth > 2) return null;
    return { tag, cls, id, text, kids: kids.slice(0, 12) };
  }
  const root = document.querySelector('#root');
  const sections = [];
  document.querySelectorAll('.carelink-page > *').forEach((el, i) => {
    sections.push({
      i,
      tag: el.tagName,
      class: el.className,
      h: el.getBoundingClientRect().height,
      text: el.textContent.slice(0, 120).replace(/\s+/g, ' '),
    });
  });
  return { sections, tree: walk(root) };
});

fs.writeFileSync(out, JSON.stringify(outline, null, 2));
console.log('wrote', out, 'sections', outline.sections.length);
outline.sections.forEach((s) => console.log(s.i, s.class, Math.round(s.h), s.text.slice(0, 60)));
await browser.close();
