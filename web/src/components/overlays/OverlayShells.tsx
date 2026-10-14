import {
  BtnNav,
  ChapterDialog,
  ChapterDialogBody,
  ChapterDialogClose,
  ChapterDialogFoot,
  ChapterDialogHead,
  ChapterDialogKicker,
  ChapterDialogPanel,
  ChapterDialogTitle,
  ChapterTablist,
  ChapterTabpanel,
  ChapterTabs,
  DetailDialog,
  DetailDialogBody,
  DetailDialogClose,
  DetailDialogHead,
  DetailDialogKicker,
  DetailDialogPanel,
  DetailDialogTitle,
  LandingDrawer,
  LandingDrawerBody,
  LandingDrawerClose,
  LandingDrawerHead,
  LandingDrawerKicker,
  LandingDrawerOverlay,
  LandingDrawerSheet,
  LandingDrawerTitle,
} from './OverlayShells.styles';

type Props = {
  numChapters: number;
};

export function DetailDialogShell() {
  return (
    <DetailDialog id="detail-dialog" aria-labelledby="detail-dialog-title">
      <DetailDialogPanel>
        <DetailDialogHead>
          <DetailDialogKicker id="detail-dialog-kicker" />
          <DetailDialogTitle id="detail-dialog-title" />
          <DetailDialogClose type="button" aria-label="Закрыть">×</DetailDialogClose>
        </DetailDialogHead>
        <DetailDialogBody id="detail-dialog-body" />
      </DetailDialogPanel>
    </DetailDialog>
  );
}

export function LandingDrawerShell() {
  return (
    <LandingDrawer id="landing-card-drawer" hidden aria-hidden="true">
      <LandingDrawerOverlay
        type="button"
        id="landing-card-drawer-overlay"
        aria-label="Закрыть панель"
        tabIndex={-1}
      />
      <LandingDrawerSheet
        role="dialog"
        aria-modal="true"
        aria-labelledby="landing-card-drawer-title"
        id="landing-card-drawer-panel"
      >
        <LandingDrawerHead>
          <LandingDrawerKicker id="landing-card-drawer-kicker" />
          <LandingDrawerTitle id="landing-card-drawer-title" />
          <LandingDrawerClose
            type="button"
            id="landing-card-drawer-close"
            aria-label="Закрыть панель"
          >
            ×
          </LandingDrawerClose>
        </LandingDrawerHead>
        <LandingDrawerBody id="landing-card-drawer-body" />
      </LandingDrawerSheet>
    </LandingDrawer>
  );
}

export function ChapterDialogShell({ numChapters }: Props) {
  const pad = String(numChapters).padStart(2, '0');
  return (
    <ChapterDialog id="chapter-dialog" aria-modal="true" aria-labelledby="chapter-dialog-title">
      <ChapterDialogPanel>
        <ChapterDialogHead>
          <ChapterDialogKicker id="chapter-dialog-kicker">
            Глава 01 / {pad}
          </ChapterDialogKicker>
          <ChapterDialogTitle id="chapter-dialog-title" />
          <ChapterDialogClose type="button" aria-label="Закрыть главу">×</ChapterDialogClose>
        </ChapterDialogHead>
        <ChapterDialogBody id="chapter-dialog-body">
          <ChapterTabs data-chapter-tabs>
            <ChapterTablist role="tablist" aria-label="Режим просмотра главы">
              <button
                type="button"
                role="tab"
                id="chapter-tab-structure"
                aria-selected="true"
                aria-controls="chapter-panel-structure"
                tabIndex={0}
              >
                Структура
              </button>
              <button
                type="button"
                role="tab"
                id="chapter-tab-source"
                aria-selected="false"
                aria-controls="chapter-panel-source"
                tabIndex={-1}
              >
                Исходный текст
              </button>
            </ChapterTablist>
            <ChapterTabpanel
              role="tabpanel"
              id="chapter-panel-structure"
              className="chapter-tabpanel is-active"
              aria-labelledby="chapter-tab-structure"
            />
            <ChapterTabpanel
              role="tabpanel"
              id="chapter-panel-source"
              className="chapter-tabpanel"
              aria-labelledby="chapter-tab-source"
              hidden
            />
          </ChapterTabs>
        </ChapterDialogBody>
        <ChapterDialogFoot>
          <BtnNav type="button" id="chapter-prev" aria-label="Предыдущая глава">
            ← Предыдущая
          </BtnNav>
          <BtnNav type="button" id="chapter-next" aria-label="Следующая глава">
            Следующая →
          </BtnNav>
        </ChapterDialogFoot>
      </ChapterDialogPanel>
    </ChapterDialog>
  );
}
