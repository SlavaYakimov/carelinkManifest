/** First sentence for card teasers (aligned with scripts/content/inline.mjs). */
export function teaserFromText(text: string): string {
  const plain = text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
  const m = plain.match(/[^.!?…]+[.!?…](?:\s|$|[»"])/);
  return (m ? m[0] : plain.slice(0, 180)).trim();
}
