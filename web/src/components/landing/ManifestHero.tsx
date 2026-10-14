import type { Structured } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';

type Props = {
  hero: Structured['hero'];
};

export function ManifestHero({ hero }: Props) {
  const firstPanel = hero.tabs.find((t) => t.selected)?.panelText ?? hero.tabs[0]?.panelText ?? '';

  return (
    <section className="carelink-hero" aria-labelledby="hero-title">
      <img
        className="carelink-hero__image"
        src={hero.image}
        alt={hero.imageAlt}
        width={1280}
        height={720}
        fetchPriority="high"
        decoding="async"
      />
      <div className="carelink-hero__overlay" aria-hidden="true" />
      <div className="carelink-hero__content" data-reveal>
        <p className="carelink-hero__kicker">Манифест CareLink · Для тех, кто рядом</p>
        <h1 id="hero-title">Carelink</h1>
        <div className="carelink-hero__subtitle">
          <i aria-hidden="true" />
          <p>вся семья в одном месте</p>
        </div>
        <p
          className="carelink-hero__standfirst"
          id="hero-tab-panel"
          data-hero-standfirst
          dangerouslySetInnerHTML={{ __html: inlineHtml(firstPanel) }}
        />
        <div className="carelink-hero__chips" role="tablist" aria-label="Темы героя" data-hero-tabs>
          {hero.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              id={tab.id}
              role="tab"
              aria-selected={tab.selected ? 'true' : 'false'}
              data-hero-tab
              data-hero-text={tab.panelText}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="carelink-hero__footer">
          <a className="carelink-hero__cta" href="#agenda">
            <span aria-hidden="true">→</span>
            Открыть манифест
          </a>
          <a className="carelink-hero__secondary" href="#glavy-manifest">
            Как это устроено →
          </a>
        </div>
      </div>
    </section>
  );
}
