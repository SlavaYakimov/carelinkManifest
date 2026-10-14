import type { Structured } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';
import {
  ValuesMini,
  ValuesMiniTeaser,
  ValuesRowIn,
  ValuesRowLead,
  ValuesRowSection,
  ValuesTrack,
} from './ValuesRow.styles';

type Props = {
  data: Structured['values'];
};

export function ValuesRow({ data }: Props) {
  return (
    <ValuesRowSection id="cennosti" aria-labelledby="cennosti-title">
      <ValuesRowIn data-reveal>
        <p className="section-label">Финал</p>
        <h2 id="cennosti-title">{data.title}</h2>
        <ValuesRowLead>{data.lead || ''}</ValuesRowLead>
      </ValuesRowIn>
      <ValuesTrack data-values-track>
        {data.items.map((item) => (
          <ValuesMini key={item.id}>
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
              <ValuesMiniTeaser
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
          </ValuesMini>
        ))}
      </ValuesTrack>
    </ValuesRowSection>
  );
}
