import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const NarrativeIntroSection = styled.section.attrs<{
  $beforeAgenda?: boolean;
  $backgroundImage?: string;
}>((p) => ({
  className: p.$beforeAgenda
    ? 'narrative-intro narrative-intro--before-agenda'
    : 'narrative-intro',
}))`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-block: ${theme.miraiIntroY};
  padding-inline: max(${theme.sectionX}, 1.25rem);
  background: ${theme.colors.wash};

  &.narrative-intro--before-agenda {
    padding-bottom: clamp(2.25rem, 5vw, 3.25rem);
    box-shadow: inset 0 -1px 0 rgba(138, 106, 59, 0.22);

    ${(p) =>
      p.$backgroundImage
        ? `
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 0;
        background-image: url('/${p.$backgroundImage.replace(/^\//, '')}');
        background-size: cover;
        background-position: center 42%;
        filter: saturate(0.82) contrast(1.04);
        transform: scale(1.02);
      }

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 0;
        background: linear-gradient(
          165deg,
          rgba(246, 239, 228, 0.94) 0%,
          rgba(246, 239, 228, 0.88) 42%,
          rgba(247, 250, 248, 0.82) 100%
        );
      }
    `
        : ''}
  }
`;

export const NarrativeIntroInner = styled.div.attrs({
  className: 'narrative-intro__inner',
})`
  position: relative;
  z-index: 1;

  h2 {
    font-family: var(--head) !important;
    font-weight: 700 !important;
    letter-spacing: -0.04em;
    line-height: 1.06;
    max-width: 18ch;
    margin-inline: auto;
  }

  p {
    font-family: var(--font-body) !important;
    max-width: ${theme.measure};
    margin-inline: auto;
  }

  @media (max-width: 760px) {
    h2 {
      font-size: clamp(1.65rem, 8.5vw, 2.15rem);
    }
  }
`;

export const NarrativeNote = styled.p.attrs({
  className: 'narrative-intro__note',
})`
  margin: 1rem 0 0;
  font: 400 14px/1.5 ${theme.fonts.body};
  color: #5a4636;
`;

export const AgendaFormatRail = styled.div.attrs({
  className: 'narrative-intro__format-rail',
  'aria-label': 'Как устроена каждая связка',
})`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.65rem, 2vw, 1.1rem);
  max-width: ${theme.measure};
  margin: clamp(1.35rem, 3vw, 1.85rem) auto 0;
  padding: clamp(0.85rem, 2vw, 1.05rem);
  background: rgba(247, 250, 248, 0.9);
  border: 1px solid rgba(31, 92, 74, 0.14);
  box-shadow: 0 12px 40px rgba(20, 32, 27, 0.06);
  border-radius: ${theme.miraiRadius};

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const AgendaFormatStep = styled.div`
  text-align: left;

  b {
    display: block;
    font: 600 10px/1.35 ${theme.fonts.label};
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${theme.colors.bronze};
    margin-bottom: 0.35rem;
  }

  span {
    display: block;
    font: 400 14px/1.45 ${theme.fonts.body};
    color: ${theme.colors.ink};
  }
`;

export const NarrativeSkip = styled.p.attrs({
  className: 'narrative-intro__skip',
})`
  margin: 1rem 0 0;
  font: 500 13px/1.4 ${theme.fonts.label};

  a {
    color: ${theme.colors.green};
    text-decoration: underline;
    text-underline-offset: 3px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;

    &:focus-visible {
      outline: 3px solid rgba(31, 92, 74, 0.55);
      outline-offset: 3px;
    }
  }
`;
