/** First sentence for card teasers (port of tools/build.py first_sentence). */
export function teaserFromText(text: string): string {
  const plain = text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
  const m = plain.match(/[^.!?…]+[.!?…](?:\s|$|[»"])/);
  return (m ? m[0] : plain.slice(0, 180)).trim();
}
