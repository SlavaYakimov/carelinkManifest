#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.argv[2] || '.');
const outDir = resolve(process.argv[3] || '.');
const index = join(root, 'index.html');
const sections = [
  { id: 'vyzovy', file: 'vyzovy' },
  { id: 'resheniya', file: 'resheniya' },
  { id: 'glavy', file: 'glavy' },
  { id: 'final-value', file: 'final-value' },
];
const widths = [390, 1440];

mkdirSync(outDir, { recursive: true });

async function reveal(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.section-panel, [data-reveal]').forEach((el) => {
      el.classList.add('is-visible');
    });
  });
  await page.waitForTimeout(350);
}

async function main() {
  const browser = await chromium.launch();
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto('file://' + index, { waitUntil: 'networkidle' });
    await reveal(page);
    const overflow = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    console.log(`width ${w}: scroll ${overflow.sw} client ${overflow.cw} overflow=${overflow.sw > overflow.cw}`);
    for (const s of sections) {
      const el = await page.$('#' + s.id);
      if (!el) continue;
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      const path = join(outDir, `${s.file}-${w}px.png`);
      await el.screenshot({ path });
      console.log('wrote', path);
    }
    await page.close();
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
