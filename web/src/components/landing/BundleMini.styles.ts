import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const BundleMiniArticle = styled.article.attrs({
  className: 'bundle-mini',
})`
  & > img {
    filter: saturate(0.94) contrast(1.02);
    transition: transform 240ms var(--ease-out-ui, cubic-bezier(0.23, 1, 0.32, 1)) !important;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover > img {
      filter: saturate(0.98) contrast(1.03);
      transition: transform 240ms var(--ease-out-ui, cubic-bezier(0.23, 1, 0.32, 1)) !important;
    }

    & > button:hover {
      border-color: rgba(31, 92, 74, 0.55);
      background: rgba(220, 239, 230, 0.92);
    }
  }

  & > button {
    transition: transform 160ms var(--ease-out-ui, cubic-bezier(0.23, 1, 0.32, 1));
    min-width: 44px !important;
    min-height: 44px !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    box-sizing: border-box;
    top: 0.72rem !important;
    right: 0.72rem !important;
    width: 2.75rem !important;
    height: 2.75rem !important;
    font-size: 1.05rem !important;
    z-index: 4;
    background: rgba(247, 250, 248, 0.9) !important;
    border: 1px solid ${theme.miraiHairline} !important;
    box-shadow: 0 4px 14px rgba(20, 32, 27, 0.1);

    &:active {
      transform: scale(0.97);
    }

    &:focus-visible {
      outline: 3px solid rgba(31, 92, 74, 0.55);
      outline-offset: 3px;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;

      &:active {
        transform: none;
      }
    }
  }
`;

export const BundleMiniWash = styled.div.attrs({
  className: 'bundle-mini__wash',
})``;

export const BundleMiniCopy = styled.div.attrs({
  className: 'bundle-mini__copy',
})`
  left: clamp(0.85rem, 1.15vw, 1.15rem) !important;
  right: clamp(3.1rem, 4.5vw, 3.35rem) !important;

  h3 {
    font-family: var(--head) !important;
    font-weight: 700 !important;
    font-size: clamp(1rem, 1.08vw, 1.28rem) !important;
    line-height: 1.12 !important;
    letter-spacing: -0.02em;
    color: ${theme.colors.titleOnWash} !important;
    display: block;
    overflow: visible;
    overflow-wrap: anywhere;
    hyphens: auto;
  }

  p {
    font-family: var(--font-label) !important;
    font-size: clamp(0.6875rem, 0.72vw, 0.75rem) !important;
    font-weight: 600 !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase;
    color: ${theme.colors.ink} !important;
  }

  @media (max-width: 760px) {
    left: clamp(0.8rem, 3.5vw, 1.05rem) !important;
    right: clamp(2.85rem, 10vw, 3.35rem) !important;
    padding-bottom: 0.15rem;

    h3 {
      font-size: clamp(0.92rem, 4.2vw, 1.05rem) !important;
      line-height: 1.15 !important;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      overflow-wrap: normal;
      text-overflow: ellipsis;
    }
  }
`;

export const BundleMiniFiction = styled.span.attrs({
  className: 'bundle-mini__fiction',
})``;
