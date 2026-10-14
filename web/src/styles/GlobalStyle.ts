import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  :root {
    --mirai-radius: ${theme.miraiRadius};
    --mirai-intro-y: ${theme.miraiIntroY};
    --mirai-hairline: ${theme.miraiHairline};
    --bundle-chain-label: ${theme.bundleChainLabel};
    --bundle-viewport-pad: ${theme.bundleViewportPad};
    --bronze-ink: ${theme.colors.bronzeInk};
    --title-on-wash: ${theme.colors.titleOnWash};
    --ui-label-min: ${theme.uiLabelMin};
    --hero-block-min-h: ${theme.heroBlockMinH};
    --bronze: var(--bronze-ink);
  }

  @media (max-width: 760px) {
    :root {
      --hero-block-min-h: ${theme.heroBlockMinHMobile};
    }
  }

  @media (max-width: 760px) {
    :root {
      --bundle-chain-label: 5.65rem;
    }
  }

  @media (min-width: 761px) and (max-width: 1024px) {
    :root {
      --bundle-chain-label: 6.75rem;
    }
  }

  @media (min-width: 1200px) {
    :root {
      --bundle-chain-label: 7.35rem;
    }
  }

  ::selection {
    background: ${theme.colors.mint};
  }

  body.has-site-header .bundle-stage,
  body.has-site-header .chapters-stage {
    top: var(--header-h, ${theme.headerH});
    height: calc(100vh - var(--header-h, ${theme.headerH}));
  }

  body.has-site-header .bundle-panel,
  body.has-site-header .chapters-panel {
    top: var(--header-h, ${theme.headerH});
  }

  @media (width <= 760px) {
    body.has-site-header .bundle-viewport,
    body.has-site-header .chapters-viewport {
      height: calc(100vh - var(--header-h, ${theme.headerH}) - 3.1rem);
    }
  }

  /* Residual from former manifesto.css + impeccable-polish.css */

  .carelink-page .chapters-set[aria-hidden='true'] .chapter-card {
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .carelink-page .bundle-track,
    .carelink-page .chapters-sets {
      will-change: auto !important;
    }

    .carelink-page .bundle-scroll,
    .carelink-page .chapters-scroll {
      scroll-behavior: auto;
    }

    .carelink-page .carelink-hero__cta,
    .carelink-page .carelink-hero__chips button,
    .carelink-page .bundle-card,
    .carelink-page .chapter-card {
      transition: none !important;
    }
  }

  .challenge-item,
  .solution-item {
    border-radius: var(--mirai-radius, 4px);
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.65) inset;
  }

  .challenge-example {
    border-radius: var(--mirai-radius, 4px);
  }

  .owl {
    border-radius: var(--mirai-radius, 4px);
  }

  .chapter-detail,
  .bundle-detail {
    border-radius: var(--mirai-radius, 4px) !important;
    border: 1px solid rgba(31, 92, 74, 0.16);
    box-shadow: var(--shadow-soft);
  }
`;
