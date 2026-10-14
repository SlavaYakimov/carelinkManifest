import type { HeroBlock } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';
import {
  CarelinkHero,
  HeroChips,
  HeroContent,
  HeroCta,
  HeroFooter,
  HeroImage,
  HeroLead,
  HeroOverlay,
  HeroPanel,
  HeroSecondary,
  HeroStandfirst,
} from './ManifestHero.styles';

type Props = {
  hero: HeroBlock;
};

const DEFAULT_PRIMARY = { href: '#agenda', label: 'Читать манифест' };
const DEFAULT_SECONDARY = { href: '#glavy-manifest', label: 'Что входит в Workspace →' };
const DEFAULT_TITLE = 'Carelink';
const DEFAULT_LEAD =
  '<strong>Спокойная забота — без одной головы.</strong> Хранители ведут контакты, здоровье и договорённости в <strong>Workspace — приглашения родным, данные по 152‑ФЗ.</strong>';

export function ManifestHero({ hero }: Props) {
  const firstPanel = hero.tabs.find((t) => t.selected)?.panelText ?? hero.tabs[0]?.panelText ?? '';
  const primary = hero.primaryCta ?? DEFAULT_PRIMARY;
  const secondary = hero.secondaryCta ?? DEFAULT_SECONDARY;
  const title = hero.title?.trim() || DEFAULT_TITLE;
  const lead = hero.subtitle?.trim() || DEFAULT_LEAD;

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
        <HeroPanel>
          <h1 id="hero-title">{title}</h1>
          <HeroLead dangerouslySetInnerHTML={{ __html: inlineHtml(lead) }} />
          <HeroChips role="tablist" aria-label="Тема абзаца" data-hero-tabs>
            {hero.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                id={tab.id}
                role="tab"
                aria-selected={tab.selected ? 'true' : 'false'}
                aria-controls="hero-tab-panel"
                data-hero-tab
                data-hero-text={tab.panelText}
              >
                {tab.label}
              </button>
            ))}
          </HeroChips>
          <HeroStandfirst
            id="hero-tab-panel"
            role="tabpanel"
            aria-live="polite"
            data-hero-standfirst
            dangerouslySetInnerHTML={{ __html: inlineHtml(firstPanel) }}
          />
          <HeroFooter>
            <HeroCta href={primary.href}>
              <span aria-hidden="true">→</span>
              {primary.label}
            </HeroCta>
            <HeroSecondary href={secondary.href}>{secondary.label}</HeroSecondary>
          </HeroFooter>
        </HeroPanel>
      </HeroContent>
    </CarelinkHero>
  );
}
