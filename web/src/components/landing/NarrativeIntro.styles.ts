import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const NarrativeIntroSection = styled.section.attrs({
  className: 'narrative-intro',
})`
  padding-block: ${theme.miraiIntroY};
  padding-inline: max(${theme.sectionX}, 1.25rem);
  background: ${theme.colors.wash};

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
