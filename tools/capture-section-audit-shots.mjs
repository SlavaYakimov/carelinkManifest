#!/usr/bin/env node
/** Section screenshots @ 390 and 1440 for ui-ux audit (live URL or file:// index) */
import { chromium } from '/tmp/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const target = process.argv[2] || 'https://slavayakimov.github.io/carelinkManifest/';
const outDir = resolve(process.argv[3] || '/opt/cursor/artifacts/ui-ux-audit');
const prefix = process.argv[4] || 'before';

const sections = [
  { slug: 'hero', sel: '.carelink-hero' },
  { slug: 'truth-layer', sel: '#manifest-truth' },
  { slug: 'intro-agenda', sel: '#agenda-intro' },
  { slug: 'agenda', sel: '#agenda' },
  { slug: 'intro-chapters', sel: '#glavy-intro' },
  { slug: 'chapters', sel: '#glavy-manifest' },
  { slug: 'values', sel: '#cennosti' },
  { slug: 'skills', sel: '#navyki' },
];
const widths = [390, 768, 1440];

mkdirSync(join(outDir, prefix), { recursive: true });

async function prep(page) {
  await page.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
  });
  await page.waitForTimeout(400);
}

const browser = await chromium.launch();
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: Math.min(w === 390 ? 844 : 900, 900) } });
  const url = target.startsWith('http') ? target : 'file://' + resolve(target);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await prep(page);
  for (const s of sections) {
    const el = await page.$(s.sel);
    if (!el) {
      console.warn('missing', s.sel);
      continue;
    }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(w === 390 && s.slug === 'agenda' ? 500 : 200);
    const path = join(outDir, prefix, `${s.slug}-${w}px.png`);
    await el.screenshot({ path });
    console.log('wrote', path);
  }
  await page.close();
}
await browser.close();
