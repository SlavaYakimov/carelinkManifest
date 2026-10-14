#!/usr/bin/env node
/**
 * Recreates repo-root images/ as symlinks to assets/images/{block}/.
 * Public URLs stay images/... (web/public/images -> ../../images).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = path.join(root, 'images');
const canonRoot = path.join(root, 'assets', 'images');

/** @type {{ name: string, target: string, type: 'dir' | 'file' }} */
const COMPAT = [
  { name: 'agenda', target: '../assets/images/agenda', type: 'dir' },
  { name: 'chapters', target: '../assets/images/chapters-landing', type: 'dir' },
  { name: 'chapter-images', target: '../assets/images/chapter-images', type: 'dir' },
  { name: 'landing', target: '../assets/images/landing', type: 'dir' },
  { name: 'hero-family-table.jpg', target: '../assets/images/hero/hero-family-table.jpg', type: 'file' },
  { name: 'hero-family-table.webp', target: '../assets/images/hero/hero-family-table.webp', type: 'file' },
  { name: 'PROMPTS.md', target: '../assets/images/meta/PROMPTS.md', type: 'file' },
  { name: 'owl-portrait.jpg', target: '../assets/images/meta/owl-portrait.jpg', type: 'file' },
];

const articleDir = path.join(canonRoot, 'article');
if (fs.existsSync(articleDir)) {
  for (const name of fs.readdirSync(articleDir)) {
    if (name.startsWith('.')) continue;
    COMPAT.push({
      name,
      target: `../assets/images/article/${name}`,
      type: 'file',
    });
  }
}

function resolveCanon(relFromImages) {
  return path.normalize(path.join(imagesDir, relFromImages));
}

function removeCompatEntry(name) {
  const p = path.join(imagesDir, name);
  if (!fs.existsSync(p)) return;
  const stat = fs.lstatSync(p);
  if (!stat.isSymbolicLink()) {
    throw new Error(`Refusing to remove non-symlink: ${p}`);
  }
  fs.unlinkSync(p);
}

function ensureCanonExists(relTarget) {
  const abs = resolveCanon(relTarget);
  if (!fs.existsSync(abs)) {
    throw new Error(`Missing canonical file: ${abs}`);
  }
}

let failed = false;

fs.mkdirSync(imagesDir, { recursive: true });

for (const entry of COMPAT) {
  try {
    ensureCanonExists(entry.target);
    removeCompatEntry(entry.name);
    fs.symlinkSync(entry.target, path.join(imagesDir, entry.name));
  } catch (err) {
    console.error(`sync-images-compat: ${entry.name}: ${err.message}`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log(`sync-images-compat: ${COMPAT.length} entries in images/`);
