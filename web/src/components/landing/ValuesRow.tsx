import type { Structured } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';

type Props = {
  data: Structured['values'];
};

export function ValuesRow({ data }: Props) {
  return (
    <section className="values-row" id="cennosti" aria-labelledby="cennosti-title">
      <div className="values-row-in section-panel" data-reveal>
        <p className="section-label">Финал</p>
        <h2 id="cennosti-title">{data.title}</h2>
        <p className="values-row-lead">{data.lead || ''}</p>
      </div>
      <div className="values-track" data-values-track>
        {data.items.map((item) => (
          <article key={item.id} className="values-mini agenda-mini">
            {item.image ? (
              <picture>
                <img
                  src={item.image}
                  alt={item.image_alt || item.title}
                  loading="lazy"
                  className="values-mini-img"
                />
              </picture>
            ) : null}
            <div className="agenda-mini-text">
              <span className="mono agenda-mini-label">{item.kicker}</span>
              <h3 className="agenda-mini-title">{item.title}</h3>
              <p
                className="values-mini-teaser"
                dangerouslySetInnerHTML={{ __html: inlineHtml(item.teaser || '') }}
              />
            </div>
            <button
              type="button"
              className="agenda-mini-read"
              data-detail-open={item.id}
              aria-label={`Прочитать: ${item.title}`}
            >
              <span aria-hidden="true">→</span>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
