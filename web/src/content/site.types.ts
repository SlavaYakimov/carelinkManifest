export type SiteMeta = {
  title: string;
  stand: string;
  words: number;
  numChapters: number;
  h1Html: string;
  metaChipsHtml: string;
  ogImage: string;
};

export type DetailCard = {
  id: string;
  kicker: string;
  title: string;
  bodyHtml: string;
};

export type TocItem = { n: number; title: string };

export type HeroTab = {
  id: string;
  label: string;
  selected: boolean;
  panelText: string;
};

export type HeroCta = {
  href: string;
  label: string;
};

export type HeroBlock = {
  image: string;
  imageAlt: string;
  kicker: string;
  /** Factual honesty line (sources, fiction, Концепт) — not a decorative kicker */
  trustNote?: string;
  title: string;
  subtitle: string;
  tabs: HeroTab[];
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
};

export type AgendaMini = {
  key: 'vyzov' | 'scenario' | 'reshenie';
  cardId: string;
  label: string;
  title: string;
  description: string;
  image: string;
  fictionBadge?: boolean;
};

export type AgendaBundle = {
  num: number;
  navSolutionTitle?: string;
  minis: AgendaMini[];
};

export type TruthScaleKey = 'now' | 'roadmap' | 'language';

export type TruthLayerBlock = {
  heading: string;
  lead: string;
  supports: { label: string; detail: string }[];
  pillars: {
    id: string;
    title: string;
    summary: string;
    bullets: string[];
    scale: TruthScaleKey;
  }[];
  scaleLegend: {
    key: TruthScaleKey;
    title: string;
    description: string;
  }[];
};

export type Structured = {
  hero: HeroBlock;
  truth: TruthLayerBlock;
  glossary: { term: string; definition: string }[];
  chaptersIntroNote: string;
  agenda: {
    intro_h2: string;
    intro_text: string;
    intro_note?: string;
    intro_bg?: string;
    bundles: {
      num: number;
      vyzov: { label?: string; title: string; description?: string; image?: string };
      scenario: { label?: string; title: string; description?: string; image?: string };
      reshenie: { label?: string; title: string; description?: string; image?: string };
      nav_solution_title?: string;
    }[];
  };
  chaptersLanding: {
    intro_h2: string;
    intro_text: string;
    chapters: {
      num: number;
      title: string;
      subtitle: string;
      teaser?: string;
      image?: string;
    }[];
  };
  values: {
    title: string;
    lead?: string;
    items: {
      id: string;
      kicker: string;
      title: string;
      teaser?: string;
      description: string;
      image?: string;
      image_alt?: string;
    }[];
  };
  skills: {
    title: string;
    lead?: string;
    items: {
      id: string;
      slug?: string;
      title: string;
      teaser?: string;
      description: string;
      image?: string;
    }[];
  };
  development: {
    intro: string;
    done_label?: string;
    in_progress_label?: string;
    done: { title: string; description: string }[];
    in_progress: { title: string; description: string; needs_confirmation?: boolean }[];
  };
  productArch: {
    intro: string;
    items: { title: string; description: string; note?: '' | 'direction' | 'partial' }[];
  };
  challenges: {
    intro: string;
    solutions_intro?: string;
    solutions_detail_lbl?: string;
    examples_note?: string;
    problems: {
      title: string;
      description: string;
      image?: string;
      response?: string;
    }[];
    examples: { title: string; body: string; image?: string }[];
    featured_solutions?: {
      title: string;
      problem_ref: string;
      description: string;
      image?: string;
    }[];
  };
  finaleCtas: {
    lead?: string;
    ctas: {
      id: string;
      phrase: string;
      drawer_short?: string;
      image?: string;
      image_alt?: string;
      card_kicker?: string;
    }[];
  };
  article: { tocItems: TocItem[] };
};

export type SitePayload = {
  meta: SiteMeta;
  brandOwlHtml: string;
  article: {
    introHtml: string;
    chapterHtml: string;
    sourcesHtml: string;
  };
  landingCards: DetailCard[];
  structured: Structured;
};
