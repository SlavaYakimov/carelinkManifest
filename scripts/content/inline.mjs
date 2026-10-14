/** Escape + inline markdown (Концепт badge, bold, em). */
export function inline(t) {
  if (!t) return '';
  let s = String(t);
  s = s.replace(/<strong>(.+?)<\/strong>/gi, '**$1**');
  s = s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  s = s.replace(/`([^`]+)`/g, (_, c) => {
    if (c === 'Концепт') {
      return '<span class="badge" title="Не найдено в источниках, требует подтверждения">Концепт</span>';
    }
    return `<code>${c}</code>`;
  });
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])/g, '<em>$1</em>');
  return s;
}

export function firstSentence(text) {
  const plain = String(text)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
  const m = plain.match(/[^.!?]+[.!?]+/);
  return m ? m[0].trim() : plain.trim().slice(0, 120);
}
