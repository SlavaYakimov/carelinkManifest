import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const ValuesRowSection = styled.section.attrs({
  className: 'values-row',
})`
  background: ${theme.colors.wash};
  padding-bottom: 2rem;

  .section-label {
    text-align: center;
    font-family: ${theme.fonts.label} !important;
    font-weight: 600;
    font-size: clamp(0.68rem, 0.8vw, 0.78rem);
    letter-spacing: 0.12em;
  }

  h2 {
    font: 700 clamp(1.35rem, 2.5vw, 1.75rem) / 1.2 ${theme.fonts.head};
    color: ${theme.colors.green};
    text-align: center;
    margin: 0 0 0.5rem;
    letter-spacing: -0.03em;
  }
`;

export const ValuesRowIn = styled.div.attrs({
  className: 'values-row-in section-panel',
})`
  @media (min-width: 1200px) {
    &.section-panel {
      max-width: ${theme.pageMax};
      margin-inline: auto;
    }
  }
`;

export const ValuesRowLead = styled.p.attrs({
  className: 'values-row-lead',
})`
  text-align: center;
  max-width: 40rem;
  margin: 0 auto 1.5rem;
  font: 400 15px/1.55 ${theme.fonts.body};
  color: #5a4636;
  max-width: ${theme.measure};
  padding-inline: 0.5rem;
`;

export const ValuesTrack = styled.div.attrs({
  className: 'values-track',
})`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-inline: max(${theme.sectionX}, 1rem);
  gap: 0.75rem;
  scroll-padding-inline: 1rem;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 900px) {
    .values-mini {
      flex: 0 0 85vw;
    }
  }

  @media (max-width: 760px) {
    .values-mini {
      flex: 0 0 min(72vw, 280px);
      min-width: min(72vw, 280px);
    }
  }

  @media (min-width: 1200px) {
    .values-mini {
      flex: 0 0 calc((100% - 5 * 0.75rem) / 6);
      max-width: 220px;
    }
  }
`;

export const ValuesMini = styled.article.attrs({
  className: 'values-mini agenda-mini',
})`
  flex: 0 0 calc(100% / 6);
  min-width: 160px;
  scroll-snap-align: start;
  aspect-ratio: 3/4;
  max-height: 420px;
  position: relative;
  border-radius: ${theme.miraiRadius};
  overflow: hidden;
  border: 1px solid ${theme.miraiHairline};

  picture img,
  .values-mini-img {
    filter: saturate(0.94) contrast(1.02);
  }

  .agenda-mini-read,
  button[data-detail-open] {
    top: 0.65rem;
    right: 0.65rem;
    position: absolute;
    z-index: 2;
    min-width: 44px !important;
    min-height: 44px !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    box-sizing: border-box;
  }

  @media (hover: hover) and (pointer: fine) {
    button[data-detail-open]:hover {
      background: rgba(220, 239, 230, 0.95);
      border-color: ${theme.colors.green};
    }
  }
`;

export const ValuesMiniTeaser = styled.p.attrs({
  className: 'values-mini-teaser',
})`
  font: 400 11px/1.35 ${theme.fonts.body};
`;
