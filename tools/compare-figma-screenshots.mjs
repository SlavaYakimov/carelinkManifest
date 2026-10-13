#!/usr/bin/env node
/**
 * Side-by-side section screenshots: Figma Make vs local build.
 * Requires: npx playwright install --with-deps chromium
 * Usage: node tools/compare-figma-screenshots.mjs
 */
import { chromium } from '/tmp/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const outDir = '/opt/cursor/artifacts/screenshots/compare';
fs.mkdirSync(outDir, { recursive: true });

const server = spawn('python3', ['-m', 'http.server', '8777', '--directory', '/workspace'], {
  stdio: 'ignore',
});
await new Promise((r) => setTimeout(r, 800));

const widths = [1440, 390];
const figma = 'https://ribbon-rake-92617748.figma.site/';
const local = 'http://127.0.0.1:8777/index.html';

const sections = [
  { name: 'hero', scroll: 0, selector: '.carelink-hero' },
  { name: 'intro-agenda', scroll: 0, selector: '#agenda-intro, .narrative-intro' },
  { name: 'agenda', scroll: 'agenda', selector: '.bundle-scroll, #agenda' },
  { name: 'intro-chapters', scroll: 0, selector: '#glavy-intro' },
  { name: 'chapters', scroll: 'chapters', selector: '.chapters-scroll, #glavy-manifest' },
  { name: 'values', scroll: 0, selector: '#cennosti', localOnly: true },
];

const browser = await chromium.launch();
for (const w of widths) {
  for (const sec of sections) {
    for (const [label, url] of [
      ['figma', figma],
      ['ours', local],
    ]) {
      if (sec.localOnly && label === 'figma') continue;
      const page = await browser.newPage({ viewport: { width: w, height: 900 } });
      await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
      await page.waitForTimeout(800);
      if (sec.scroll === 'agenda') {
        await page.evaluate(() => {
          const el = document.querySelector('.bundle-scroll, #agenda');
          if (el) window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top);
        });
        await page.waitForTimeout(400);
      } else if (sec.scroll === 'chapters') {
        await page.evaluate(() => {
          const el = document.querySelector('.chapters-scroll, #glavy-manifest');
          if (el) window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top);
        });
        await page.waitForTimeout(400);
      }
      const file = path.join(outDir, `${sec.name}-${label}-${w}.png`);
      const loc = page.locator(sec.selector).first();
      const count = await loc.count();
      if (count) {
        try {
          await loc.screenshot({ path: file, timeout: 15000 });
        } catch {
          await page.screenshot({ path: file });
        }
      } else {
        await page.screenshot({ path: file });
      }
      await page.close();
      console.log('saved', file);
    }
  }
}
await browser.close();
server.kill();
