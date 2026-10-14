import { useEffect } from 'react';
import { initSite } from '../interactivity/initSite';
import { initManifesto } from '../interactivity/initManifesto';
import { initChapterDialog } from '../interactivity/initChapterDialog';
import { initDetailModal } from '../interactivity/initDetailModal';
import { initLandingDrawer } from '../interactivity/initLandingDrawer';

export function useSiteInteractivity(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    initSite();
    initChapterDialog();
    initLandingDrawer();
    initManifesto();
    initDetailModal();
  }, [enabled]);
}
