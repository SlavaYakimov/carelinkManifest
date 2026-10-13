#!/usr/bin/env node
import { chromium } from '/tmp/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';

const base = '/workspace/reference/figma-make/snippets';
fs.mkdirSync(base, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://ribbon-rake-92617748.figma.site/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

const data = await page.evaluate(() => {
  const pick = (sel) => document.querySelector(sel)?.outerHTML?.slice(0, 12000) || '';
  const imgs = [...document.querySelectorAll('img[src]')].map((i) => i.src).slice(0, 40);
  const bundlePanel = document.querySelector('.bundle-panel__heading')?.innerHTML || '';
  const firstBundle = document.querySelector('.bundle-card')?.outerHTML?.slice(0, 4000) || '';
  const navBtn = document.querySelector('.bundle-panel li.is-active button')?.outerHTML || '';
  return {
    imgs,
    bundlePanel,
    firstBundle,
    navBtn,
    bundleScroll: pick('.bundle-scroll'),
    chaptersScroll: pick('.chapters-scroll').slice(0, 8000),
    heroImg: document.querySelector('.carelink-hero__image')?.getAttribute('src'),
  };
});

for (const [k, v] of Object.entries(data)) {
  if (typeof v === 'string') fs.writeFileSync(path.join(base, k + '.txt'), v);
  else fs.writeFileSync(path.join(base, k + '.json'), JSON.stringify(v, null, 2));
}
console.log('heroImg', data.heroImg);
console.log('imgs', data.imgs.length);
await browser.close();
