#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const outDir = '/opt/cursor/artifacts/prototypes';
const index = join(root, 'index.html');
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
  for (const w of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto('file://' + index, { waitUntil: 'networkidle' });
    await reveal(page);
    for (const s of [
      { id: 'vyzovy', file: `site-vyzovy-${w}px` },
      { id: 'glavy', file: `site-glavy-${w}px` },
    ]) {
      const el = await page.$('#' + s.id);
      if (!el) continue;
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await el.screenshot({ path: join(outDir, s.file + '.png') });
      console.log('wrote', join(outDir, s.file + '.png'));
    }
    await page.close();
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
