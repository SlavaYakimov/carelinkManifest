import { SiteFooter } from './components/shell/SiteFooter';
import { SiteHeader } from './components/shell/SiteHeader';
import { HtmlSection } from './components/HtmlSection';
import { LandingCardStore } from './components/LandingCardStore';
import {
  ChapterDialogShell,
  DetailDialogShell,
  LandingDrawerShell,
} from './components/overlays/OverlayShells';
import { ManifestHero } from './components/landing/ManifestHero';
import { TruthLayer } from './components/landing/TruthLayer';
import { AgendaScroll } from './components/landing/AgendaScroll';
import { ChaptersScroll } from './components/landing/ChaptersScroll';
import { ValuesRow } from './components/landing/ValuesRow';
import { SkillsSection } from './components/landing/SkillsSection';
import { ArticleLayout } from './components/article/ArticleLayout';
import { useDocumentMeta } from './hooks/useDocumentMeta';
import { useSiteData } from './hooks/useSiteData';
import { useSiteInteractivity } from './hooks/useSiteInteractivity';

export default function App() {
  const { site, loading } = useSiteData();

  useDocumentMeta(site?.meta);
  useSiteInteractivity(!loading && site !== null);

  if (loading || !site) {
    return (
      <p className="mono" style={{ padding: '2rem' }}>
        Загрузка манифеста…
      </p>
    );
  }

  const { meta, brandOwlHtml, sections, article, landingCards, structured } = site;

  return (
    <>
      <a className="skip" href="#top">
        К основному содержимому
      </a>
      <div className="progress" aria-hidden="true">
        <i id="bar" />
      </div>
      <SiteHeader meta={meta} brandOwlHtml={brandOwlHtml} />
      <main id="top">
        <div className="carelink-page">
          <ManifestHero hero={structured.hero} />
          <TruthLayer truth={structured.truth} />
          <AgendaScroll agenda={structured.agenda} glossary={structured.glossary} />
          <ChaptersScroll
            data={structured.chaptersLanding}
            introNote={structured.chaptersIntroNote}
          />
        </div>
        <HtmlSection html={sections.challengesLegacy} />
        <HtmlSection html={sections.chapterIndexLegacy} />
        <HtmlSection html={sections.development} />
        <HtmlSection html={sections.productArch} />
        <ArticleLayout article={article} tocItems={structured.article.tocItems} />
        <ValuesRow data={structured.values} />
        <SkillsSection data={structured.skills} />
        <HtmlSection html={sections.finaleLegacy} />
      </main>
      <LandingCardStore cards={landingCards} />
      <DetailDialogShell />
      <LandingDrawerShell />
      <ChapterDialogShell numChapters={meta.numChapters} />
      <SiteFooter brandOwlHtml={brandOwlHtml} />
    </>
  );
}
