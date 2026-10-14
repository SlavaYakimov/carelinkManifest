import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const LandingGlossary = styled.aside.attrs({
  className: 'landing-glossary',
})`
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(31, 92, 74, 0.15);
  max-width: ${theme.measure};
  margin-inline: auto;
  color: ${theme.colors.mut};
`;

export const GlossaryTitle = styled.h3.attrs({
  className: 'landing-glossary__title',
})`
  font: 600 11px/1.3 ${theme.fonts.label};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.green};
  margin: 0 0 0.65rem;
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
    color: #3d4843;
  }
`;
