#!/usr/bin/env node
/**
 * PR #4 screenshots: sections + optional landing modal.
 * Usage: node tools/capture-pr4.mjs <repo-root> <output-dir> [--modal]
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.argv[2] || '.');
const outDir = resolve(process.argv[3] || '.');
const withModal = process.argv.includes('--modal');
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
    for (const s of sections) {
      const el = await page.$('#' + s.id);
      if (!el) {
        console.warn('missing #' + s.id);
        continue;
      }
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      const path = join(outDir, `${s.file}-${w}px.png`);
      await el.screenshot({ path });
      console.log('wrote', path);
    }
    if (withModal) {
      const btn = await page.$('[data-landing-card="problem-1"]');
      if (btn) {
        await btn.click();
        await page.waitForTimeout(400);
        const dialog = await page.$('#landing-card-dialog[open]');
        const path = join(outDir, `modal-landing-${w}px.png`);
        if (dialog) {
          await page.screenshot({ path, fullPage: false });
        } else {
          await page.screenshot({ path, fullPage: false });
        }
        console.log('wrote', path);
        await page.evaluate(() => {
          const d = document.getElementById('landing-card-dialog');
          if (d && d.open) d.close();
        });
      }
    }
    await page.close();
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
