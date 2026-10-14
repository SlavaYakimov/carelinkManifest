type Props = {
  numChapters: number;
};

export function DetailDialogShell() {
  return (
    <dialog className="detail-dialog" id="detail-dialog" aria-labelledby="detail-dialog-title">
      <div className="detail-dialog-panel">
        <header className="detail-dialog-head">
          <span className="mono detail-dialog-kicker" id="detail-dialog-kicker" />
          <h2 className="detail-dialog-title" id="detail-dialog-title" />
          <button
            type="button"
            className="detail-dialog-close chapter-dialog-close"
            aria-label="Закрыть"
          >
            ×
          </button>
        </header>
        <div
          className="detail-dialog-body landing-card-dialog-body"
          id="detail-dialog-body"
        />
      </div>
    </dialog>
  );
}

export function LandingDrawerShell() {
  return (
    <div className="landing-drawer" id="landing-card-drawer" hidden aria-hidden="true">
      <button
        type="button"
        className="landing-drawer-overlay"
        id="landing-card-drawer-overlay"
        aria-label="Закрыть панель"
        tabIndex={-1}
      />
      <div
        className="landing-drawer-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="landing-card-drawer-title"
        id="landing-card-drawer-panel"
      >
        <header className="landing-drawer-head">
          <span className="mono landing-drawer-kicker" id="landing-card-drawer-kicker" />
          <h2 className="landing-drawer-title" id="landing-card-drawer-title" />
          <button
            type="button"
            className="landing-drawer-close chapter-dialog-close"
            id="landing-card-drawer-close"
            aria-label="Закрыть панель"
          >
            ×
          </button>
        </header>
        <div
          className="landing-drawer-body landing-card-dialog-body"
          id="landing-card-drawer-body"
        />
      </div>
    </div>
  );
}

export function ChapterDialogShell({ numChapters }: Props) {
  const pad = String(numChapters).padStart(2, '0');
  return (
    <dialog className="chapter-dialog" id="chapter-dialog" aria-modal="true" aria-labelledby="chapter-dialog-title">
      <div className="chapter-dialog-panel">
        <header className="chapter-dialog-head">
          <span className="mono chapter-dialog-kicker" id="chapter-dialog-kicker">
            Глава 01 / {pad}
          </span>
          <h2 className="chapter-dialog-title" id="chapter-dialog-title" />
          <button type="button" className="chapter-dialog-close" aria-label="Закрыть главу">
            ×
          </button>
        </header>
        <div className="chapter-dialog-body" id="chapter-dialog-body">
          <div className="chapter-tabs" data-chapter-tabs>
            <div role="tablist" className="chapter-tablist" aria-label="Режим просмотра главы">
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
            </div>
            <div
              role="tabpanel"
              id="chapter-panel-structure"
              className="chapter-tabpanel is-active"
              aria-labelledby="chapter-tab-structure"
            />
            <div
              role="tabpanel"
              id="chapter-panel-source"
              className="chapter-tabpanel"
              aria-labelledby="chapter-tab-source"
              hidden
            />
          </div>
        </div>
        <footer className="chapter-dialog-foot">
          <button type="button" className="btn-nav" id="chapter-prev" aria-label="Предыдущая глава">
            ← Предыдущая
          </button>
          <button type="button" className="btn-nav" id="chapter-next" aria-label="Следующая глава">
            Следующая →
          </button>
        </footer>
      </div>
    </dialog>
  );
}
