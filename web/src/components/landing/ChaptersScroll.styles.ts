import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const ChaptersScrollSection = styled.section.attrs({
  className: 'chapters-scroll',
})`
  border-top: 1px solid rgba(138, 106, 59, 0.18);
`;

export const ChaptersStage = styled.div.attrs({
  className: 'chapters-stage',
})``;

export const ChaptersViewport = styled.div.attrs({
  className: 'chapters-viewport',
})`
  scroll-padding-inline: clamp(1rem, 2.5vw, 1.75rem);
  padding-inline: clamp(1rem, 2.5vw, 1.75rem);
  box-sizing: border-box;

  @media (max-width: 760px) {
    padding-inline: 0.85rem;
    scroll-padding-inline: 0.85rem;
  }
`;

export const ChaptersSets = styled.div.attrs({
  className: 'chapters-sets',
})``;

export const ChaptersSet = styled.div.attrs({
  className: 'chapters-set',
})``;

export const ChapterCard = styled.article.attrs({
  className: 'chapter-card',
})`
  & > img {
    filter: saturate(0.94) contrast(1.02);
    transition: transform 240ms ease-out !important;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover > img {
      filter: saturate(0.98) contrast(1.03);
    }
  }

  &:focus-visible {
    outline: 3px solid rgba(31, 92, 74, 0.55);
    outline-offset: 3px;
  }
`;

export const ChapterCardShade = styled.div.attrs({
  className: 'chapter-card__shade',
})``;

export const ChapterCardCopy = styled.div.attrs({
  className: 'chapter-card__copy',
})`
  left: clamp(1.15rem, 1.75vw, 1.55rem) !important;
  right: clamp(1rem, 1.5vw, 1.4rem) !important;

  h3 {
    font-family: var(--head) !important;
    font-weight: 700 !important;
    font-size: clamp(1rem, 1.08vw, 1.28rem) !important;
    line-height: 1.12 !important;
  }
`;

export const ChaptersPanel = styled.aside.attrs({
  className: 'chapters-panel',
})``;

export const ChaptersPanelMobile = styled.div.attrs({
  className: 'chapters-panel__mobile',
})``;

export const ChaptersPanelHeading = styled.div.attrs({
  className: 'chapters-panel__heading',
})`
  h2 {
    font-family: var(--head) !important;
    font-weight: 700 !important;
    letter-spacing: 0.04em;
  }

  & > p {
    font-family: var(--font-body) !important;
    color: ${theme.colors.bronzeInk};
  }
`;

export const ScrollStageHint = styled.span.attrs<{ $variant: 'desktop' | 'mobile' }>(
  (p) => ({
    className: `scroll-stage-hint scroll-stage-hint--${p.$variant}`,
  }),
)``;

export const ChapterNavButton = styled.button`
  min-height: 44px;
  padding-block: 0.55rem;
  box-sizing: border-box;
  width: 100%;
  font-family: ${theme.fonts.body} !important;
  font-size: 0.8125rem !important;
  grid-template-columns: 2.1rem minmax(0, 1fr) !important;
  column-gap: 0.55rem !important;
  align-items: baseline !important;

  &:focus-visible {
    outline: 3px solid rgba(31, 92, 74, 0.55);
    outline-offset: 3px;
  }

  span {
    font-family: ${theme.fonts.label} !important;
    font-size: ${theme.uiLabelMin} !important;
    letter-spacing: 0.1em !important;
    white-space: nowrap;
  }

  strong {
    font-family: ${theme.fonts.body} !important;
    font-size: 0.8125rem !important;
    overflow-wrap: anywhere;
    font-family: var(--head) !important;
  }
`;

export const ChaptersPanelList = styled.ol`
  li.is-active > button {
    background: rgba(220, 239, 230, 0.58) !important;
    border-left-color: ${theme.colors.green} !important;
    box-shadow: inset 3px 0 0 ${theme.colors.green};
    font-weight: 600;
  }

  li.is-in-set > button {
    background: rgba(247, 250, 248, 0.65) !important;
    border-left-color: rgba(31, 92, 74, 0.12) !important;
    box-shadow: none;
    font-weight: 500;
  }
`;
