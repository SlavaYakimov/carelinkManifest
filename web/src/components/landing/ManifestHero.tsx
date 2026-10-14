import type { Structured } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';
import {
  CarelinkHero,
  HeroChips,
  HeroContent,
  HeroCta,
  HeroFooter,
  HeroImage,
  HeroKicker,
  HeroOverlay,
  HeroSecondary,
  HeroStandfirst,
  HeroSubtitle,
} from './ManifestHero.styles';

type Props = {
  hero: Structured['hero'];
};

export function ManifestHero({ hero }: Props) {
  const firstPanel = hero.tabs.find((t) => t.selected)?.panelText ?? hero.tabs[0]?.panelText ?? '';

  return (
    <CarelinkHero aria-labelledby="hero-title">
      <HeroImage
        src={hero.image}
        alt={hero.imageAlt}
        width={1280}
        height={720}
        fetchPriority="high"
        decoding="async"
      />
      <HeroOverlay aria-hidden="true" />
      <HeroContent data-reveal>
        <HeroKicker>Манифест CareLink · Для тех, кто рядом</HeroKicker>
        <h1 id="hero-title">Carelink</h1>
        <HeroSubtitle>
          <i aria-hidden="true" />
          <p>вся семья в одном месте</p>
        </HeroSubtitle>
        <HeroStandfirst
          id="hero-tab-panel"
          data-hero-standfirst
          dangerouslySetInnerHTML={{ __html: inlineHtml(firstPanel) }}
        />
        <HeroChips role="tablist" aria-label="Темы героя" data-hero-tabs>
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
        </HeroChips>
        <HeroFooter>
          <HeroCta href="#agenda">
            <span aria-hidden="true">→</span>
            Открыть манифест
          </HeroCta>
          <HeroSecondary href="#glavy-manifest">Как это устроено →</HeroSecondary>
        </HeroFooter>
      </HeroContent>
    </CarelinkHero>
  );
}
