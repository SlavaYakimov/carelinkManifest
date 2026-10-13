#!/usr/bin/env node
import { chromium } from 'playwright';
import { join } from 'node:path';

const outDir = '/opt/cursor/artifacts/prototypes';

async function main() {
  const browser = await chromium.launch();
  for (const w of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto('https://impeccable.style/neo-mirai/', { waitUntil: 'networkidle' });
    const el = await page.locator('#speakers');
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await el.screenshot({ path: join(outDir, `ref-neo-speakers-${w}px.png`) });
    console.log('wrote', join(outDir, `ref-neo-speakers-${w}px.png`));
    await page.close();
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
