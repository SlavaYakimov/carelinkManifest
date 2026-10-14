import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const TruthLayerSection = styled.section.attrs({
  className: 'truth-layer',
})`
  background: linear-gradient(180deg, #f0e8dc 0%, ${theme.colors.wash} 100%);
  border-bottom: 1px solid rgba(138, 106, 59, 0.32);
  max-width: none;
  padding-inline: max(${theme.sectionX}, 1.25rem);
  padding-block: clamp(1.5rem, 4vw, 2.35rem);
  --bronze: var(--bronze-ink);
`;

export const TruthLayerTitle = styled.h2.attrs({
  className: 'truth-layer__title',
})`
  font: 700 1.15rem/1.25 ${theme.fonts.head};
  color: ${theme.colors.green};
  margin: 0 0 0.65rem;
  max-width: ${theme.measure};
  margin-inline: auto;

  @media (max-width: 760px) {
    font-size: 1.05rem;
  }

  @media (min-width: 1200px) {
    font-size: 1.22rem;
  }
`;

export const TruthLayerBody = styled.p.attrs({
  className: 'truth-layer__body',
})`
  font: 400 15px/1.55 ${theme.fonts.body};
  color: ${theme.colors.mut};
  margin: 0;
  max-width: ${theme.measure};
  margin-inline: auto;
`;
