import { inlineHtml } from '../../lib/inlineHtml';

type DevItem = {
  title: string;
  description: string;
  needs_confirmation?: boolean;
};

type DevData = {
  intro: string;
  done_label?: string;
  in_progress_label?: string;
  done: DevItem[];
  in_progress: DevItem[];
};

function statusBadge(needsConfirmation: boolean) {
  if (!needsConfirmation) return null;
  return (
    <span
      className="badge dev-badge dev-badge--unconfirmed"
      title="Не подтверждено первоисточником или статусом команды"
    >
      требует подтверждения
    </span>
  );
}

type Props = {
  data: DevData;
};

export function DevelopmentSection({ data }: Props) {
  return (
    <section className="development" id="razrabotka" aria-labelledby="development-title">
      <div className="development-in section-panel" data-reveal>
        <p className="section-label">Разработка</p>
        <h2 id="development-title" className="development-title">Разработка</h2>
        <p
          className="development-intro"
          dangerouslySetInnerHTML={{ __html: inlineHtml(data.intro) }}
        />
        <div className="dev-columns">
          <div className="dev-column">
            <h3 className="mono dev-column-lbl">{data.done_label || 'Уже сделано'}</h3>
            <ol className="dev-list dev-list--done">
              {data.done.map((it, i) => (
                <li key={it.title} className="dev-item dev-item--done">
                  <span className="mono dev-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="dev-body">
                    <h3 className="dev-title">{it.title}</h3>
                    <p
                      className="dev-desc"
                      dangerouslySetInnerHTML={{ __html: inlineHtml(it.description) }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="dev-column">
            <h3 className="mono dev-column-lbl">{data.in_progress_label || 'В работе'}</h3>
            <ol className="dev-list dev-list--progress">
              {data.in_progress.map((it, i) => (
                <li key={it.title} className="dev-item dev-item--progress">
                  <span className="mono dev-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="dev-body">
                    {statusBadge(Boolean(it.needs_confirmation))}
                    <h3 className="dev-title">{it.title}</h3>
                    <p
                      className="dev-desc"
                      dangerouslySetInnerHTML={{ __html: inlineHtml(it.description) }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
