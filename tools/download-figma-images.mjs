#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { chromium } from '/tmp/node_modules/playwright/index.mjs';

const baseUrl = 'https://ribbon-rake-92617748.figma.site';
const outRoot = '/workspace/reference/figma-make/images';
const repoRoot = '/workspace';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
const srcs = await page.evaluate(() =>
  [...document.querySelectorAll('img[src]')].map((i) => i.getAttribute('src')).filter(Boolean),
);
await browser.close();

const unique = [...new Set(srcs)];
console.log('images', unique.length);

async function fetchOne(rel) {
  const url = rel.startsWith('http') ? rel : baseUrl + rel;
  const localRel = rel.replace(/^\//, '');
  const refPath = path.join(outRoot, localRel);
  const repoPath = path.join(repoRoot, localRel);
  fs.mkdirSync(path.dirname(refPath), { recursive: true });
  fs.mkdirSync(path.dirname(repoPath), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) {
    console.warn('fail', url, res.status);
    return;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(refPath, buf);
  if (!fs.existsSync(repoPath) || fs.statSync(repoPath).size !== buf.length) {
    fs.writeFileSync(repoPath, buf);
  }
  console.log('ok', localRel, buf.length);
}

for (const rel of unique) await fetchOne(rel);
