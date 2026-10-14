#!/usr/bin/env node
/** Automated ui-ux-pro-max checks against live or local URL */
import { chromium } from '/tmp/node_modules/playwright/index.mjs';

const url = process.argv[2] || 'https://slavayakimov.github.io/carelinkManifest/';
const widths = [390, 768, 1440];
const findings = [];

function add(severity, section, issue, fix) {
  findings.push({ severity, section, issue, fix });
}

const browser = await chromium.launch();
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(600);

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const overflow = doc.scrollWidth > doc.clientWidth + 1;
    const skip = document.querySelector('.skip');
    const main = document.querySelector('main#top');
    const results = {
      overflow,
      scrollW: doc.scrollWidth,
      clientW: doc.clientWidth,
      skipHref: skip?.getAttribute('href'),
      hasMain: !!main,
      smallTargets: [],
      missingAlt: [],
      focusOutline: [],
      contrastHints: [],
      sticky: [],
      reducedMotionCss: !!document.querySelector('link[href*="motion"]'),
    };

    document.querySelectorAll('button, a, [role=tab], [role=button]').forEach((el) => {
      if (el.closest('.landing-block-legacy, [aria-hidden="true"]')) return;
      if (el.getAttribute('aria-hidden') === 'true') return;
      if (el.tabIndex === -1 && el.getAttribute('role') !== 'tab') return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.width < 44 || r.height < 44) {
        const label = el.getAttribute('aria-label') || el.textContent?.slice(0, 30) || el.className;
        if (!el.classList.contains('bundle-mini') && !el.closest('.bundle-mini__copy')) {
          results.smallTargets.push({ label, w: Math.round(r.width), h: Math.round(r.height) });
        }
      }
    });

    document.querySelectorAll('img').forEach((img) => {
      if (img.closest('.landing-block-legacy, [aria-hidden="true"]')) return;
      if (img.getAttribute('aria-hidden') === 'true') return;
      if (!img.hasAttribute('alt')) {
        results.missingAlt.push(img.src?.slice(-40));
      }
    });

    ['.bundle-mini > button', '.carelink-hero__chips button', '.top-nav a', '.bundle-arrow'].forEach((sel) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const style = getComputedStyle(el);
      results.focusOutline.push({
        sel,
        outline: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      });
    });

    ['.bundle-scroll', '.chapters-scroll', '.top'].forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) {
        const st = getComputedStyle(el);
        results.sticky.push({ sel, position: st.position, top: st.top, zIndex: st.zIndex });
      }
    });

    return results;
  });

  if (metrics.overflow) {
    add('High', `Global @${w}px`, `Horizontal overflow (${metrics.scrollW}px > ${metrics.clientW}px)`, 'clip/contain wide tracks; audit .values-track, .bundle-track, legacy bleed');
  }
  if (metrics.skipHref !== '#top') {
    add('High', 'A11y', `Skip link href=${metrics.skipHref}`, 'Point skip to #top (main landmark)');
  }

  const tiny = metrics.smallTargets.filter((t) => t.w < 44 || t.h < 44);
  const uniqueTiny = [...new Map(tiny.map((t) => [t.label + t.w, t])).values()].slice(0, 8);
  if (uniqueTiny.length && w <= 768) {
    uniqueTiny.forEach((t) => {
      add('Medium', `Touch @${w}px`, `Target ~${t.w}×${t.h}px: ${t.label}`, 'min 44×44px or padding; bundle-mini read btn already small by design — expand hit area');
    });
  }

  if (metrics.missingAlt.length) {
    add('Medium', 'A11y', `Images without alt: ${metrics.missingAlt.length}`, 'Add alt or aria-hidden on decorative imgs');
  }

  await page.close();
}

// Reduced motion check
const page = await browser.newPage();
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(url, { waitUntil: 'networkidle' });
const motion = await page.evaluate(() => {
  const hero = getComputedStyle(document.querySelector('.carelink-hero__cta') || document.body);
  const bundle = document.querySelector('.bundle-track');
  return {
    heroTransition: hero.transitionDuration,
    bundleWillChange: bundle ? getComputedStyle(bundle).willChange : null,
  };
});
if (motion.heroTransition && motion.heroTransition !== '0s') {
  add('Low', 'Motion', 'Hero CTA may animate under reduced-motion', 'Ensure @media (prefers-reduced-motion) disables transforms/transitions site-wide');
}
await page.close();

// Keyboard: focus visible on tab
const page2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page2.goto(url, { waitUntil: 'networkidle' });
await page2.keyboard.press('Tab');
const focused = await page2.evaluate(() => {
  const el = document.activeElement;
  return el ? { tag: el.tagName, class: el.className, href: el.getAttribute('href') } : null;
});
if (focused && focused.class?.includes('skip') === false && focused.tag === 'BODY') {
  add('Medium', 'Focus', 'First Tab may not expose skip link visibly', 'Ensure .skip:focus positioning');
}
await browser.close();

console.log(JSON.stringify(findings, null, 2));
