#!/usr/bin/env node
import { chromium } from '/tmp/node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://ribbon-rake-92617748.figma.site/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const hero = await page.evaluate(() => {
  const h = document.querySelector('.carelink-hero');
  if (!h) return null;
  return {
    html: h.outerHTML.slice(0, 3500),
    chips: [...h.querySelectorAll('.carelink-hero__chips button')].map((b) => ({
      label: b.textContent.trim(),
      selected: b.getAttribute('aria-selected'),
    })),
  };
});
console.log(JSON.stringify(hero, null, 2));
await browser.close();
