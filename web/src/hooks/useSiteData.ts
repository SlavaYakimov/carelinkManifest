import { useEffect, useState } from 'react';
import type { SitePayload } from '../content/site.types';
import stub from '../content/site.stub.json';

export function useSiteData() {
  const [site, setSite] = useState<SitePayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/site.json')
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data: SitePayload) => {
        if (!cancelled) setSite(data);
      })
      .catch(() => {
        if (!cancelled) setSite(stub as SitePayload);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { site, loading };
}
