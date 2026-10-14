import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const BundleScroll = styled.section.attrs({
  className: 'bundle-scroll',
})`
  border-top: 1px solid rgba(138, 106, 59, 0.18);

  [data-bundle-viewport] {
    touch-action: pan-x pan-y;
  }
`;

export const BundleStage = styled.div.attrs({
  className: 'bundle-stage',
})``;

export const BundleViewport = styled.div.attrs({
  className: 'bundle-viewport',
})`
  scroll-padding-inline: var(--bundle-viewport-pad);
  padding-inline: var(--bundle-viewport-pad);
  box-sizing: border-box;

  @media (max-width: 760px) {
    padding-inline: 0.85rem;
    scroll-padding-inline: 0.85rem;
  }
`;

export const BundleTrack = styled.div.attrs({
  className: 'bundle-track',
})`
  padding-inline: 0.5rem 0.35rem;
  padding-block: 0.35rem 0.15rem;
  box-sizing: border-box;
`;

export const BundleCard = styled.article.attrs({
  className: 'bundle-card',
})`
  &:first-child {
    margin-left: 0 !important;
  }

  & + & {
    margin-left: -8px;
  }
`;

export const BundleCardMinis = styled.div.attrs({
  className: 'bundle-card__minis',
})``;

export const BundleArrow = styled.button.attrs<{ $variant: 'previous' | 'next' }>(
  (p) => ({
    className: `bundle-arrow bundle-arrow--${p.$variant}`,
  }),
)`
  width: 2.75rem !important;
  height: 2.75rem !important;
  font-size: 1.2rem !important;
  background: rgba(247, 250, 248, 0.94) !important;
  border-color: ${theme.miraiHairline} !important;
  box-shadow: 0 6px 18px rgba(20, 32, 27, 0.12);
  min-height: 44px;
  min-width: 44px;
  box-sizing: border-box;

  ${(p) =>
    p.$variant === 'previous'
      ? `left: max(0.65rem, calc(var(--bundle-viewport-pad) - 0.15rem)) !important;`
      : `right: max(0.65rem, calc(var(--bundle-viewport-pad) - 0.15rem)) !important;`}

  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:disabled) {
      border-color: rgba(31, 92, 74, 0.55);
      background: rgba(220, 239, 230, 0.92);
    }
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(31, 92, 74, 0.55);
    outline-offset: 3px;
  }
`;

export const BundleProgress = styled.div.attrs({
  className: 'bundle-progress',
})`
  height: 4px;
  background: rgba(247, 250, 248, 0.85) !important;
  border: 1px solid ${theme.miraiHairline};
  border-radius: 999px;

  i {
    display: block;
    width: 100% !important;
    height: 100%;
    background: var(--bronze) !important;
    border-radius: 999px;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.2s var(--ease-out-ui, cubic-bezier(0.23, 1, 0.32, 1));
    will-change: transform;
  }

  @media (prefers-reduced-motion: reduce) {
    i {
      transition: none !important;
    }
  }
`;

export const BundlePanel = styled.aside.attrs({
  className: 'bundle-panel',
})`
  min-height: 0;
  --bronze: var(--bronze-ink);

  nav {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;

    ol {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: auto;
      scroll-padding-block: 0.4rem;
      scrollbar-width: thin;
      scrollbar-color: rgba(138, 106, 59, 0.42) rgba(247, 250, 248, 0.5);
    }
  }

  ol > li.is-active,
  li.is-active {
    background: rgba(220, 239, 230, 0.55) !important;
    box-shadow: inset 3px 0 0 ${theme.colors.green} !important;
  }

  li.is-active > button {
    background: transparent !important;
    border-left-color: transparent !important;
  }

  li.is-active .bundle-panel__chain button {
    background: transparent !important;
    border-left-color: transparent !important;
  }

  li.is-active .bundle-panel__chain button strong {
    font-weight: 600 !important;
    color: ${theme.colors.ink};
  }

  li.is-active .bundle-panel__chain {
    padding-block: 0.2rem;
  }

  li.is-active .bundle-panel__chain button:hover,
  li.is-active .bundle-panel__chain button:focus-visible,
  li.is-active .bundle-panel__chain button.is-focused {
    background: rgba(247, 250, 248, 0.55) !important;
    border-left-color: rgba(31, 92, 74, 0.2) !important;
  }

  ol > li {
    border-bottom: 1px solid rgba(31, 92, 74, 0.1);
  }
`;

export const BundlePanelHeading = styled.div.attrs({
  className: 'bundle-panel__heading',
})`
  & > p {
    font-family: ${theme.fonts.label} !important;
    font-size: ${theme.uiLabelMin} !important;
    font-weight: 600 !important;
    letter-spacing: 0.14em !important;
    text-transform: uppercase;
    color: ${theme.colors.bronzeInk} !important;
    margin: 0 0 0.55rem !important;
  }

  h2 {
    font-family: var(--head) !important;
    font-weight: 700 !important;
    font-size: clamp(1.28rem, 1.75vw, 1.75rem) !important;
    letter-spacing: 0.05em !important;
    line-height: 1.08 !important;
    text-transform: uppercase;

    i {
      font-family: var(--head) !important;
      font-style: normal;
      color: ${theme.colors.bronzeInk};
    }
  }
`;

export const BundlePanelChain = styled.div.attrs({
  className: 'bundle-panel__chain',
})`
  & > span {
    font-family: ${theme.fonts.label} !important;
    font-size: ${theme.uiLabelMin} !important;
    letter-spacing: 0.08em;
    line-height: 1.35 !important;
  }

  button {
    display: grid !important;
    grid-template-columns: var(--bundle-chain-label) minmax(0, 1fr) !important;
    column-gap: 0.65rem !important;
    align-items: baseline !important;
    row-gap: 0.12rem;
    padding: 0.35rem 0.45rem !important;
    min-height: 44px;
    min-width: 44px;
    box-sizing: border-box;
    padding-block: 0.55rem;
    font-family: ${theme.fonts.body} !important;
    line-height: 1.35 !important;

    &:active {
      transform: translateY(1px);
    }

    &:hover,
    &:focus-visible,
    &.is-focused {
      background: rgba(247, 250, 248, 0.92) !important;
      border-left-color: rgba(138, 106, 59, 0.45) !important;
    }

    &:focus-visible {
      outline: 3px solid rgba(31, 92, 74, 0.55);
      outline-offset: 3px;
    }

    b {
      grid-column: 1;
      font-family: ${theme.fonts.label} !important;
      font-size: ${theme.uiLabelMin} !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase;
      color: ${theme.colors.green};
      white-space: nowrap;
      display: block;
      min-width: 0;
    }

    strong {
      grid-column: 2;
      font-family: ${theme.fonts.body} !important;
      font-size: 0.8125rem !important;
      font-weight: 500 !important;
      line-height: 1.35 !important;
      overflow-wrap: anywhere;
      hyphens: auto;
      display: block;
      min-width: 0;
    }
  }

  @media (max-width: 760px) {
    button {
      column-gap: 0.5rem !important;
    }
  }

  @media (min-width: 1200px) {
    button {
      column-gap: 0.75rem !important;
    }
  }
`;

export const BundleNavButton = styled.button``;
