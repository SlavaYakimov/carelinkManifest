import { useEffect } from 'react';
import type { SiteMeta } from '../content/site.types';

export function useDocumentMeta(meta: SiteMeta | undefined) {
  useEffect(() => {
    if (!meta) return;
    document.title = `${meta.title} — манифест Carelink`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', meta.stand);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', `${meta.title} — манифест Carelink`);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.stand);
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', meta.ogImage);
  }, [meta]);
}
