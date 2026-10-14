import type { Structured } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';

type Props = {
  data: Structured['skills'];
};

export function SkillsSection({ data }: Props) {
  return (
    <section className="skills-section" id="navyki" aria-labelledby="navyki-title">
      <div className="skills-in section-panel" data-reveal>
        <p className="section-label">Память проекта</p>
        <h2 id="navyki-title">{data.title}</h2>
        <p
          className="skills-lead"
          dangerouslySetInnerHTML={{ __html: inlineHtml(data.lead || '') }}
        />
        <div className="skills-grid">
          {data.items.map((item) => (
            <article key={item.id} className="skills-card">
              {item.image ? (
                <img src={item.image} alt={item.title} loading="lazy" className="skills-card-img" />
              ) : null}
              <div className="skills-card-body">
                <span className="mono skills-slug">{item.slug || ''}</span>
                <h3>{item.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: inlineHtml(item.teaser || '') }} />
                <button
                  type="button"
                  className="agenda-mini-read"
                  data-detail-open={item.id}
                  aria-label="Прочитать навык"
                >
                  →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
