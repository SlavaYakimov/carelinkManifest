import { SiteFooter } from './components/shell/SiteFooter';
import { SiteHeader } from './components/shell/SiteHeader';
import { ChallengesSection } from './components/landing/ChallengesSection';
import { DevelopmentSection } from './components/landing/DevelopmentSection';
import { ProductArchSection } from './components/landing/ProductArchSection';
import { FinaleSection } from './components/landing/FinaleSection';
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
import { CarelinkPage } from './styles/CarelinkPage.styles';
import styled from 'styled-components';

const LoadingMessage = styled.p.attrs({ className: 'mono' })`
  padding: 2rem;
`;

export default function App() {
  const { site, loading } = useSiteData();

  useDocumentMeta(site?.meta);
  useSiteInteractivity(!loading && site !== null);

  if (loading || !site) {
    return <LoadingMessage>Загрузка манифеста…</LoadingMessage>;
  }

  const { meta, brandOwlHtml, article, landingCards, structured } = site;

  return (
    <>
      <SiteHeader meta={meta} brandOwlHtml={brandOwlHtml} />
      <main id="top">
        <CarelinkPage>
          <ManifestHero hero={structured.hero} />
        </CarelinkPage>
          <TruthLayer truth={structured.truth} />
          <AgendaScroll agenda={structured.agenda} glossary={structured.glossary} />
          <ChaptersScroll
            data={structured.chaptersLanding}
            introNote={structured.chaptersIntroNote}
          />
        <ChallengesSection data={structured.challenges} />
        <DevelopmentSection data={structured.development} />
        <ProductArchSection data={structured.productArch} />
        <ArticleLayout article={article} tocItems={structured.article.tocItems} />
        <ValuesRow data={structured.values} />
        <SkillsSection data={structured.skills} />
        <FinaleSection data={structured.finaleCtas} />
      <LandingCardStore cards={landingCards} />
      <DetailDialogShell />
      <LandingDrawerShell />
      <ChapterDialogShell numChapters={meta.numChapters} />
      <SiteFooter brandOwlHtml={brandOwlHtml} />
      </main>
    </>
  );
}
