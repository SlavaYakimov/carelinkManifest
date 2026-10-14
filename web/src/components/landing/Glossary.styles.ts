import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

type Layout = 'inline' | 'truth';

const inlineShell = css`
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(31, 92, 74, 0.15);
  max-width: ${theme.measure};
`;

const truthShell = css`
  margin-top: 0;
  padding: clamp(1rem, 2.2vw, 1.25rem) clamp(1rem, 2.4vw, 1.35rem);
  max-width: none;
  width: 100%;
  border-radius: ${theme.miraiRadius};
  border: 1px solid ${theme.miraiHairline};
  background: rgba(247, 250, 248, 0.72);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.75) inset;
`;

export const LandingGlossary = styled.aside.attrs({
  className: 'landing-glossary',
})<{ $layout?: Layout }>`
  margin-inline: auto;
  color: ${theme.colors.mut};
  ${({ $layout }) => ($layout === 'truth' ? truthShell : inlineShell)}
`;

export const GlossaryTitle = styled.h3.attrs({
  className: 'landing-glossary__title',
})<{ $layout?: Layout }>`
  margin: 0 0 ${({ $layout }) => ($layout === 'truth' ? '0.85rem' : '0.65rem')};
  font: 600 11px/1.3 ${theme.fonts.label};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.green};

  ${({ $layout }) =>
    $layout === 'truth' &&
    css`
      text-align: center;
      font-size: 10px;
      letter-spacing: 0.14em;
    `}
`;

export const GlossaryList = styled.ul.attrs({
  className: 'landing-glossary__list',
})`
  margin: 0;
  padding: 0;
  list-style: none;
  font: 400 13px/1.45 ${theme.fonts.body};
  max-width: ${theme.measure};
  margin-inline: auto;

  li + li {
    margin-top: 0.45rem;
  }

  dfn {
    font-style: normal;
    font-weight: 600;
    color: ${theme.colors.mut};
  }
`;

export const GlossaryGrid = styled.dl.attrs({
  className: 'landing-glossary__grid',
})`
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.55rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.65rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const GlossaryEntry = styled.div.attrs({
  className: 'landing-glossary__entry',
})`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-height: 100%;
  padding: 0.65rem 0.7rem;
  border-radius: ${theme.miraiRadius};
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(31, 92, 74, 0.1);

  @media (min-width: 1024px) {
    &:nth-child(4),
    &:nth-child(5) {
      grid-column: span 1;
    }
  }
`;

export const GlossaryTerm = styled.dt.attrs({
  className: 'landing-glossary__term',
})`
  margin: 0;
  font-family: ${theme.fonts.head};
  font-weight: 700;
  font-size: 0.9375rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: ${theme.colors.greenD};
`;

export const GlossaryDef = styled.dd.attrs({
  className: 'landing-glossary__def',
})`
  margin: 0;
  font-family: ${theme.fonts.body};
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${theme.colors.mut};

  .badge {
    margin-inline: 0.1em;
    vertical-align: 0.06em;
  }
`;
