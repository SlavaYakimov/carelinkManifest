import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const CarelinkHero = styled.section.attrs({
  className: 'carelink-hero',
})``;

export const HeroImage = styled.img.attrs({
  className: 'carelink-hero__image',
})`
  filter: saturate(0.94) contrast(1.02);
`;

export const HeroOverlay = styled.div.attrs({
  className: 'carelink-hero__overlay',
})``;

export const HeroContent = styled.div.attrs({
  className: 'carelink-hero__content',
})``;

export const HeroKicker = styled.p.attrs({
  className: 'carelink-hero__kicker',
})`
  color: ${theme.colors.bronzeInk};
  letter-spacing: 0.14em;
  font-family: ${theme.fonts.label} !important;
`;

export const HeroSubtitle = styled.div.attrs({
  className: 'carelink-hero__subtitle',
})`
  p {
    font-family: ${theme.fonts.label} !important;
    color: ${theme.colors.mut} !important;
  }
`;

export const HeroStandfirst = styled.p.attrs({
  className: 'carelink-hero__standfirst',
})`
  font-family: ${theme.fonts.body} !important;
  color: ${theme.colors.mut} !important;
`;

export const HeroChips = styled.div.attrs({
  className: 'carelink-hero__chips',
})`
  button {
    min-height: 44px;
    padding: 0.65rem 0.85rem;
    color: ${theme.colors.greenD};
    border-color: ${theme.miraiHairline};
    font-family: ${theme.fonts.label} !important;

    &[aria-selected='true'] {
      color: ${theme.colors.green};
      background: rgba(220, 239, 230, 0.82);
      border-color: rgba(31, 92, 74, 0.48);
      box-shadow: inset 0 -2px 0 ${theme.colors.green};
    }

    &:active {
      transform: translateY(1px);
    }

    &:focus-visible {
      outline: 3px solid rgba(31, 92, 74, 0.55);
      outline-offset: 3px;
    }
  }

  h1 {
    color: ${theme.colors.green} !important;
    font-family: var(--head) !important;
  }
`;

export const HeroFooter = styled.div.attrs({
  className: 'carelink-hero__footer',
})``;

export const HeroCta = styled.a.attrs({
  className: 'carelink-hero__cta',
})`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding-top: 0.35rem;
  padding-bottom: 0.35rem;
  font-family: ${theme.fonts.label} !important;

  &:focus-visible {
    outline: 3px solid rgba(31, 92, 74, 0.55);
    outline-offset: 3px;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-2px);
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
  padding-top: 0.35rem;
  padding-bottom: 0.35rem;
  font-family: ${theme.fonts.label} !important;

  &:focus-visible {
    outline: 3px solid rgba(31, 92, 74, 0.55);
    outline-offset: 3px;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-2px);
    }
  }
`;
