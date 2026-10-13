import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const base = 'http://127.0.0.1:8765/index.html';
const out = '/opt/cursor/artifacts/screenshots';

await mkdir(out, { recursive: true });
const browser = await chromium.launch();
for (const [name, width] of [['1440', 1440], ['390', 390]]) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${out}/manifest-after-hero-${name}.png` });
  await page.evaluate(() => {
    const el = document.getElementById('agenda');
    if (el) el.scrollIntoView({ block: 'start' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/manifest-after-agenda-${name}.png` });
  await page.evaluate(() => {
    const btn = document.querySelector('[data-detail-open="agenda-1-vyzov"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/manifest-modal-open-${name}.png` });
  await page.locator('#detail-dialog .detail-dialog-close').click();
  await page.locator('#cennosti').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/manifest-values-${name}.png` });
  await page.close();
}
await browser.close();
console.log('saved to', out);
