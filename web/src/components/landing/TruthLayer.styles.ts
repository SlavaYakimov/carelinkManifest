import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';
import type { TruthScaleKey } from '../../content/site.types';

const scaleTone = (key: TruthScaleKey) => {
  switch (key) {
    case 'now':
      return css`
        color: ${theme.colors.greenD};
        background: rgba(220, 239, 230, 0.72);
        border-color: rgba(31, 92, 74, 0.28);
      `;
    case 'roadmap':
      return css`
        color: ${theme.colors.bronzeInk};
        background: #fbf6ee;
        border-color: ${theme.colors.bronze};
      `;
    case 'language':
      return css`
        color: ${theme.colors.mut};
        background: rgba(247, 250, 248, 0.9);
        border-color: rgba(138, 106, 59, 0.35);
      `;
  }
};

export const TruthLayerSection = styled.section.attrs({
  className: 'truth-layer',
})`
  position: relative;
  overflow: hidden;
  padding-inline: max(${theme.sectionX}, 1.25rem);
  padding-block: clamp(2rem, 5vw, 3rem);
  background:
    radial-gradient(120% 80% at 50% 0%, rgba(220, 239, 230, 0.35) 0%, transparent 55%),
    linear-gradient(180deg, #f0e8dc 0%, ${theme.colors.wash} 48%, ${theme.colors.cream} 100%);
  border-bottom: 1px solid rgba(138, 106, 59, 0.28);
  --bronze: var(--bronze-ink);
`;

export const TruthLayerInner = styled.div.attrs({
  className: 'truth-layer__inner',
})`
  width: min(100%, ${theme.contentMax});
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: clamp(1.15rem, 2.5vw, 1.65rem);
`;

export const TruthLayerHeader = styled.header.attrs({
  className: 'truth-layer__header',
})`
  max-width: ${theme.measure};
  margin-inline: auto;
  text-align: center;
`;

export const TruthLayerTitle = styled.h2.attrs({
  className: 'truth-layer__title',
})`
  margin: 0;
  font-family: ${theme.fonts.head};
  font-weight: 700;
  font-size: clamp(1.35rem, 0.6vw + 1.2rem, 1.65rem);
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: ${theme.colors.greenD};
  text-wrap: balance;
`;

export const TruthLayerLead = styled.p.attrs({
  className: 'truth-layer__lead',
})`
  margin: 0.65rem 0 0;
  font-family: ${theme.fonts.body};
  font-size: clamp(1rem, 0.25vw + 0.94rem, 1.0625rem);
  line-height: 1.65;
  color: ${theme.colors.mut};
  text-wrap: pretty;
`;

export const TruthSupports = styled.div.attrs({
  className: 'truth-layer__supports',
  role: 'list',
})`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 0.65rem 1rem;
  max-width: 52rem;
  margin-inline: auto;
  padding: 0.65rem 0.85rem;
  border-radius: ${theme.miraiRadius};
  background: rgba(247, 250, 248, 0.55);
  border: 1px solid ${theme.miraiHairline};
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.7) inset;
`;

export const TruthSupportItem = styled.div.attrs({ role: 'listitem' })`
  flex: 1 1 14rem;
  min-width: min(100%, 14rem);
  text-align: center;
  font-family: ${theme.fonts.body};
  font-size: 0.9375rem;
  line-height: 1.45;
  color: ${theme.colors.ink};

  strong {
    display: block;
    font-family: ${theme.fonts.label};
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.11em;
    text-transform: uppercase;
    color: ${theme.colors.bronze};
    margin-bottom: 0.2rem;
  }
`;

export const TruthPillars = styled.ol.attrs({
  className: 'truth-layer__pillars',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(0.85rem, 2vw, 1.1rem);

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: stretch;
  }
`;

export const TruthPillarCard = styled.li.attrs({
  className: 'truth-layer__pillar',
})`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-height: 100%;
  padding: clamp(1rem, 2vw, 1.2rem) clamp(1rem, 2vw, 1.15rem) 1rem;
  background: rgba(247, 250, 248, 0.92);
  border: 1px solid ${theme.miraiHairline};
  border-radius: ${theme.miraiRadius};
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.85) inset,
    0 18px 40px -32px rgba(31, 92, 74, 0.35);
  transition:
    transform 280ms ${theme.ease},
    box-shadow 280ms ${theme.ease},
    border-color 280ms ${theme.ease};

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto auto 0;
    width: 100%;
    height: 3px;
    border-radius: ${theme.miraiRadius} ${theme.miraiRadius} 0 0;
    background: linear-gradient(
      90deg,
      ${theme.colors.green} 0%,
      rgba(31, 92, 74, 0.45) 55%,
      rgba(138, 106, 59, 0.55) 100%
    );
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-3px);
      border-color: rgba(31, 92, 74, 0.28);
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.9) inset,
        0 22px 48px -28px rgba(31, 92, 74, 0.38);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

export const PillarMeta = styled.div.attrs({
  className: 'truth-layer__pillar-meta',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.15rem;
`;

export const PillarIndex = styled.span.attrs({
  className: 'truth-layer__pillar-index mono',
})`
  font-size: 11px;
  letter-spacing: 0.08em;
  color: ${theme.colors.bronze};
`;

export const PillarScale = styled.span.attrs<{ $scale: TruthScaleKey }>({
  className: 'truth-layer__pillar-scale',
})<{ $scale: TruthScaleKey }>`
  font: 600 9px/1.2 ${theme.fonts.label};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  border: 1px solid;
  white-space: nowrap;
  ${({ $scale }) => scaleTone($scale)}
`;

export const PillarTitle = styled.h3.attrs({
  className: 'truth-layer__pillar-title',
})`
  margin: 0;
  font-family: ${theme.fonts.head};
  font-weight: 700;
  font-size: clamp(1.08rem, 0.35vw + 1rem, 1.22rem);
  line-height: 1.14;
  letter-spacing: -0.02em;
  color: ${theme.colors.greenD};
  text-wrap: balance;
`;

export const PillarSummary = styled.p.attrs({
  className: 'truth-layer__pillar-summary',
})`
  margin: 0;
  font-family: ${theme.fonts.body};
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${theme.colors.ink};
`;

export const PillarList = styled.ul.attrs({
  className: 'truth-layer__pillar-list',
})`
  margin: 0.15rem 0 0;
  padding: 0 0 0 1.05rem;
  font-family: ${theme.fonts.body};
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${theme.colors.mut};

  li + li {
    margin-top: 0.35rem;
  }

  li::marker {
    color: ${theme.colors.green};
  }
`;

export const TruthScaleLegend = styled.div.attrs({
  className: 'truth-layer__scale-legend',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.65rem;
  padding-top: 0.35rem;
  border-top: 1px solid rgba(31, 92, 74, 0.12);

  @media (min-width: 720px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.85rem;
  }
`;

export const ScaleLegendItem = styled.div.attrs({
  className: 'truth-layer__scale-item',
})`
  padding: 0.65rem 0.75rem;
  border-radius: ${theme.miraiRadius};
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(31, 92, 74, 0.1);
`;

export const ScaleLegendHead = styled.div.attrs({
  className: 'truth-layer__scale-head',
})`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.55rem;
  margin-bottom: 0.35rem;
`;

export const ScaleLegendTitle = styled.span.attrs({
  className: 'truth-layer__scale-title',
})`
  font: 600 10px/1.3 ${theme.fonts.label};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.colors.greenD};
`;

export const ScaleLegendDesc = styled.p.attrs({
  className: 'truth-layer__scale-desc',
})`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${theme.colors.mut};
`;

export const TruthGlossaryWrap = styled.div.attrs({
  className: 'truth-layer__glossary',
})`
  width: 100%;
  margin-inline: auto;
  padding-top: clamp(0.35rem, 1vw, 0.65rem);
  border-top: 1px solid rgba(31, 92, 74, 0.1);
`;
