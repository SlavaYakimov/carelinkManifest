/** Design tokens aligned with assets/style.css :root */
export const theme = {
  colors: {
    green: '#1f5c4a',
    greenD: '#163f33',
    bronze: '#8a6a3b',
    bronzeInk: '#7a5e34',
    cream: '#f7faf8',
    ink: '#14201b',
    mint: '#dcefe6',
    mut: '#3d4843',
    line: '#d3e2da',
    wash: '#f6efe4',
    titleOnWash: '#163f33',
  },
  /** Semantic roles — Persuade surfaces (hero, trust chrome) */
  semantic: {
    trust: {
      surface: 'rgba(247, 250, 248, 0.94)',
      surfaceBorder: 'rgba(31, 92, 74, 0.18)',
      note: '#5a6b64',
    },
    text: {
      display: '#1f5c4a',
      lead: '#14201b',
      body: '#3d4843',
      onPrimary: '#f7faf8',
    },
    action: {
      primary: '#1f5c4a',
      primaryHover: '#163f33',
      secondary: '#7a5e34',
    },
  },
  fonts: {
    head: "'Playfair Display', Georgia, 'Times New Roman', serif",
    body: "'Echo 2', Inter, ui-sans-serif, system-ui, sans-serif",
    label: "'Cosmetics MS', Inter, ui-sans-serif, system-ui, sans-serif",
    mono: 'ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace',
  },
  ease: 'cubic-bezier(.16,1,.3,1)',
  easeQuint: 'cubic-bezier(.22,1,.36,1)',
  headerH: '74px',
  sectionX: 'clamp(1.25rem, 5vw, 3.5rem)',
  sectionY: 'clamp(4.5rem, 10vw, 7.5rem)',
  measure: '62ch',
  pageMax: '1440px',
  contentMax: '1120px',
  miraiRadius: '4px',
  miraiHairline: 'rgba(31, 92, 74, 0.16)',
  miraiIntroY: 'clamp(3.5rem, 7.5vw, 6.5rem)',
  bundleChainLabel: '7.15rem',
  bundleViewportPad: 'clamp(1.15rem, 2.75vw, 2rem)',
  /** Hero section min block height (content can grow taller). */
  heroBlockMinH: 'clamp(30rem, 78vh, 62rem)',
  heroBlockMinHMobile: 'clamp(32rem, 98vh, 40rem)',
  uiLabelMin: '11px',
  shadowSoft: '0 28px 90px rgba(20,32,27,.1)',
} as const;

export type AppTheme = typeof theme;
