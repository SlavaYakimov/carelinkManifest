import type { Structured } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';

type Props = {
  data: Structured['finaleCtas'];
};

export function FinaleSection({ data }: Props) {
  const ctas = data.ctas || [];
  const total = ctas.length;

  return (
    <section className="landing-finale" id="final-value" aria-labelledby="finale-title">
      <div className="landing-finale-in section-panel" data-reveal>
        <p className="section-label">Финальные ценности</p>
        <h2 id="finale-title" className="landing-finale-title">Инструмент, чтобы создавать свою реальность</h2>
        {data.lead ? (
          <p
            className="landing-finale-lead"
            dangerouslySetInnerHTML={{ __html: inlineHtml(data.lead) }}
          />
        ) : null}
        <ol className="chapter-grid ticket-grid landing-card-grid landing-card-grid--finale">
          {ctas.map((cta, i) => {
            const num = i + 1;
            const kicker = cta.card_kicker || `Ценность · ${String(num).padStart(2, '0')}/${String(total).padStart(2, '0')}`;
            const teaser = cta.drawer_short || '';
            const aria = teaser ? `${cta.phrase} — ${teaser}` : cta.phrase;
            return (
              <li key={cta.id} className="chapter-grid-cell finale-cta-cell landing-ticket-cell">
                <button
                  type="button"
                  className="chapter-grid-card chapter-grid-card--ticket mirai-ticket landing-card-ticket finale-cta-btn finale-cta-card"
                  data-landing-card={cta.id}
                  aria-label={aria}
                >
                  <span className="mono landing-card-kicker">{kicker}</span>
                  <h3
                    className="landing-card-title landing-card-title--finale"
                    dangerouslySetInnerHTML={{ __html: inlineHtml(cta.phrase) }}
                  />
                  {teaser ? (
                    <p
                      className="landing-card-teaser landing-card-teaser--finale"
                      dangerouslySetInnerHTML={{ __html: inlineHtml(teaser) }}
                    />
                  ) : null}
                  {cta.image ? (
                    <figure className="chapter-grid-media landing-card-media finale-cta-media">
                      <img
                        src={cta.image}
                        alt={cta.image_alt || cta.phrase}
                        loading="eager"
                        className="finale-cta-img"
                      />
                    </figure>
                  ) : null}
                  <footer className="mirai-ticket__foot landing-card-cta" aria-hidden="true">
                    <span className="landing-card-read mirai-ticket__pill">Прочитать</span>
                    <span className="landing-card-cta-hint mirai-ticket__meta">панель справа</span>
                  </footer>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
