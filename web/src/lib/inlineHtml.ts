/** Minimal port of scripts/content/inline.mjs for JSON copy fields. */
export function inlineHtml(text: string): string {
  if (!text) return '';
  let t = text.replace(/<strong>(.+?)<\/strong>/gi, '**$1**');
  t = t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  t = t.replace(/`([^`]+)`/g, (_m, c: string) => {
    const label = c.trim();
    if (label.toLowerCase() === 'концепт') {
      return '<span class="badge">Концепт</span>';
    }
    return `<code>${c}</code>`;
  });
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  return t;
}
