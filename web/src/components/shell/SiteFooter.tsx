import {
  FootBadge,
  FootBrand,
  FootBrandText,
  FootCopy,
  FootNav,
  FootNote,
  SiteFoot,
} from './SiteFooter.styles';

type Props = {
  brandOwlHtml: string;
};

export function SiteFooter({ brandOwlHtml }: Props) {
  return (
    <SiteFoot>
      <FootBrand href="#top">
        <span dangerouslySetInnerHTML={{ __html: brandOwlHtml }} />
        <FootBrandText>
          <b>Carelink</b>
          <small>Спокойная забота</small>
        </FootBrandText>
      </FootBrand>
      <FootCopy>© 2026 Carelink · Слава Якимов</FootCopy>
      <FootNav aria-label="Разделы в подвале">
        <a href="#agenda">Повестка</a>
        <a href="#glavy-manifest">Главы</a>
        <a href="#cennosti">Ценности</a>
        <a href="#navyki">Навыки</a>
        <a href="#top">Наверх</a>
      </FootNav>
      <FootNote>
        <FootBadge>Концепт</FootBadge> — ещё обсуждается
      </FootNote>
    </SiteFoot>
  );
}
