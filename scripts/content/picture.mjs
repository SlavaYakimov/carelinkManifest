import { inline } from './inline.mjs';

const IMG_WIDTH = 1280;
const IMG_HEIGHT = 720;

export function imgPicture(src, alt, imgClass = '', chapNum = null, loading = 'lazy') {
  const base = String(src || '').split('?')[0];
  if (!base) return '';
  const webp = base.replace(/\.jpe?g$/i, '.webp');
  const cls = imgClass ? ` class="${imgClass}"` : '';
  const altEsc = inline(alt || '');
  return (
    `<picture><source type="image/webp" srcset="${webp}">` +
    `<img src="${base}" alt="${altEsc}" loading="${loading}" decoding="async" ` +
    `width="${IMG_WIDTH}" height="${IMG_HEIGHT}"${cls}></picture>`
  );
}
