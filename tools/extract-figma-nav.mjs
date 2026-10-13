#!/usr/bin/env node
import { chromium } from '/tmp/node_modules/playwright/index.mjs';
import fs from 'fs';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://ribbon-rake-92617748.figma.site/', { waitUntil: 'networkidle' });
const nav = await page.evaluate(() => {
  const ol = document.querySelector('.bundle-panel ol');
  if (!ol) return null;
  return ol.outerHTML;
});
fs.writeFileSync('/workspace/reference/figma-make/snippets/bundle-nav.html', nav || '');
console.log('nav len', nav?.length);
await browser.close();
