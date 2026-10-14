import styled from 'styled-components';
import { theme } from '../../styles/theme';

const { semantic } = theme;

export const CarelinkHero = styled.section.attrs({
  className: 'carelink-hero',
})`
  height: auto !important;
  min-height: var(--hero-block-min-h, ${theme.heroBlockMinH});
  overflow: hidden;
  background: ${theme.colors.wash} !important;
  border-bottom: 1px solid ${theme.miraiHairline} !important;

  h1 {
    color: ${semantic.text.display} !important;
    font-family: var(--head) !important;
    font-weight: 700 !important;
    font-size: clamp(2.5rem, 5.8vw, 4rem) !important;
    line-height: 1.02 !important;
    letter-spacing: -0.03em !important;
    margin: 0 !important;
    text-wrap: balance;
  }

  @media (max-width: 760px) {
    h1 {
      font-size: clamp(2.15rem, 10vw, 2.85rem) !important;
      line-height: 1.06 !important;
    }
  }
`;

export const HeroImage = styled.img.attrs({
  className: 'carelink-hero__image',
})`
  filter: saturate(0.9) contrast(1.03);
`;

export const HeroOverlay = styled.div.attrs({
  className: 'carelink-hero__overlay',
})`
  background: linear-gradient(
    102deg,
    rgba(247, 250, 248, 0.9) 0%,
    rgba(247, 250, 248, 0.78) 34%,
    rgba(246, 239, 228, 0.42) 52%,
    rgba(20, 32, 27, 0.22) 100%
  ) !important;
`;

export const HeroContent = styled.div.attrs({
  className: 'carelink-hero__content',
})`
  height: auto !important;
  min-height: var(--hero-block-min-h, ${theme.heroBlockMinH});
  justify-content: center !important;
  gap: clamp(0.55rem, 1vw, 0.85rem);
  padding-top: calc(var(--header-h, ${theme.headerH}) + clamp(0.75rem, 2vw, 1.25rem)) !important;
  padding-bottom: clamp(1.35rem, 3vw, 2.25rem) !important;
  width: min(44rem, 58vw) !important;

  @media (max-width: 760px) {
    width: 100% !important;
    min-height: var(--hero-block-min-h, ${theme.heroBlockMinHMobile});
    justify-content: flex-end !important;
    padding-top: calc(var(--header-h, ${theme.headerH}) + 0.35rem) !important;
    padding-bottom: max(1.1rem, env(safe-area-inset-bottom)) !important;
  }
`;

export const HeroHeadPanel = styled.div.attrs({
  className: 'carelink-hero__panel carelink-hero__head-panel',
})`
  display: flex;
  flex-direction: column;
  gap: clamp(0.45rem, 0.85vw, 0.65rem);
  padding: clamp(1rem, 2vw, 1.35rem) clamp(1.05rem, 2.2vw, 1.45rem);
  max-width: 42rem;
  background: ${semantic.trust.surface};
  border: 1px solid ${semantic.trust.surfaceBorder};
  border-radius: ${theme.miraiRadius};
  box-shadow: ${theme.shadowSoft};
`;

export const HeroTopic = styled.div.attrs({
  className: 'carelink-hero__topic',
})`
  display: flex;
  flex-direction: column;
  gap: clamp(0.35rem, 0.7vw, 0.5rem);
  max-width: 42rem;
  padding: clamp(0.35rem, 0.8vw, 0.55rem) clamp(0.15rem, 0.4vw, 0.35rem) 0;
`;

export const HeroLead = styled.p.attrs({
  className: 'carelink-hero__lead',
})`
  margin: 0 !important;
  font-family: ${theme.fonts.body} !important;
  font-size: clamp(0.98rem, 0.25vw + 0.94rem, 1.08rem);
  font-weight: 500;
  line-height: 1.58;
  max-width: min(42ch, 100%);
  text-wrap: balance;
  color: ${semantic.text.lead} !important;
`;

export const HeroStandfirst = styled.p.attrs({
  className: 'carelink-hero__standfirst',
})`
  font-family: ${theme.fonts.body} !important;
  font-size: clamp(0.95rem, 0.15vw + 0.92rem, 1.02rem);
  line-height: 1.65;
  max-width: min(48ch, 100%);
  min-height: clamp(3.6em, 12vw, 4.6em);
  color: ${semantic.text.body} !important;
  margin: 0 !important;
  padding-top: clamp(0.35rem, 0.8vw, 0.5rem);
  border-top: 1px solid ${theme.miraiHairline};

  @media (max-width: 760px) {
    min-height: clamp(4.8em, 24vw, 5.8em);
  }
`;

export const HeroChips = styled.div.attrs({
  className: 'carelink-hero__chips',
})`
  margin-top: 0 !important;
  max-width: 100%;
  justify-content: flex-start !important;
  gap: 0.45rem !important;

  button {
    min-height: 44px;
    padding: 0.65rem 0.85rem;
    color: ${semantic.action.primaryHover};
    border-color: ${theme.miraiHairline};
    font-family: ${theme.fonts.label} !important;
    font-size: clamp(0.6875rem, 0.4vw + 0.62rem, 0.75rem) !important;
    letter-spacing: 0.05em !important;
    text-transform: none !important;
    backdrop-filter: none !important;
    background: rgba(247, 250, 248, 0.88) !important;
    transition: transform 160ms var(--ease-out-ui, cubic-bezier(0.23, 1, 0.32, 1)),
      background 160ms ease, border-color 160ms ease;

    &[aria-selected='true'] {
      color: ${semantic.text.display};
      background: rgba(220, 239, 230, 0.88) !important;
      border-color: rgba(31, 92, 74, 0.48);
      box-shadow: inset 0 -2px 0 ${theme.colors.green};
    }

    &:active {
      transform: scale(0.97);
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
      &:active {
        transform: none;
      }
    }

    &:focus-visible {
      outline: 3px solid rgba(31, 92, 74, 0.55);
      outline-offset: 3px;
    }
  }

  @media (max-width: 760px) {
    flex-wrap: wrap;
  }
`;

export const HeroFooter = styled.div.attrs({
  className: 'carelink-hero__footer',
})`
  margin-top: 0 !important;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(0.65rem, 1.2vw, 1.1rem) !important;

  @media (max-width: 760px) {
    justify-content: flex-start !important;
    align-items: stretch !important;
  }
`;

export const HeroCta = styled.a.attrs({
  className: 'carelink-hero__cta',
})`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.65rem 1.15rem 0.65rem 1.25rem !important;
  font-family: ${theme.fonts.label} !important;
  font-size: clamp(0.6875rem, 0.25vw + 0.65rem, 0.8rem) !important;
  font-weight: 700 !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase;
  color: ${semantic.text.onPrimary} !important;
  background: ${semantic.action.primary} !important;
  border: 1px solid rgba(31, 92, 74, 0.35) !important;
  border-radius: 999px;
  box-shadow: 0 8px 22px rgba(31, 92, 74, 0.2);
  transition: transform 160ms var(--ease-out-ui, cubic-bezier(0.23, 1, 0.32, 1)),
    background 160ms ease, box-shadow 160ms ease;

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 3px solid rgba(31, 92, 74, 0.55);
    outline-offset: 3px;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${semantic.action.primaryHover} !important;
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(22, 63, 51, 0.24);
    }

    &:active {
      transform: scale(0.97);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
    transform: none !important;
  }
`;

export const HeroSecondary = styled.a.attrs({
  className: 'carelink-hero__secondary',
})`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.15rem;
  font-family: ${theme.fonts.label} !important;
  font-size: clamp(0.72rem, 0.2vw + 0.68rem, 0.8rem) !important;
  font-weight: 600 !important;
  letter-spacing: 0.04em;
  color: ${semantic.action.primaryHover} !important;
  text-decoration: none;
  transition: transform 160ms var(--ease-out-ui, cubic-bezier(0.23, 1, 0.32, 1)),
    color 160ms ease;

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 3px solid rgba(31, 92, 74, 0.55);
    outline-offset: 3px;
    border-radius: 4px;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: ${semantic.action.primaryHover} !important;
      transform: translateY(-1px);
    }

    &:active {
      transform: scale(0.97);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
    transform: none !important;
  }
`;
