import type { SiteMeta } from '../../content/site.types';
import {
  BrandLink,
  BrandText,
  TopCta,
  TopCtaArrow,
  TopHeader,
  TopLabel,
  TopMeta,
  TopNav,
} from './SiteHeader.styles';

type Props = {
  meta: SiteMeta;
  brandOwlHtml: string;
};

export function SiteHeader({ meta, brandOwlHtml }: Props) {
  const words = meta.words.toLocaleString('ru-RU');
  const chapters = String(meta.numChapters).padStart(2, '0');

  return (
    <TopHeader>
      <BrandLink href="#top" aria-label="Carelink">
        <span dangerouslySetInnerHTML={{ __html: brandOwlHtml }} />
        <BrandText>
          <b>Carelink</b>
          <small>Спокойная забота</small>
        </BrandText>
      </BrandLink>
      <TopNav aria-label="Разделы">
        <a href="#agenda">Повестка</a>
        <a href="#glavy-manifest">Главы</a>
        <a href="#cennosti">Ценности</a>
        <a href="#navyki">Навыки</a>
        <a href="#razrabotka">Разработка</a>
        <a href="#product-arch">Архитектура</a>
        <a href="#top">Лонгрид</a>
      </TopNav>
      <TopLabel>Манифест · живой лонгрид</TopLabel>
      <TopCta href="#glavy-manifest">
        <span>К главам</span>
        <TopCtaArrow aria-hidden="true">→</TopCtaArrow>
      </TopCta>
      <TopMeta>
        {words} слов · {chapters} глав
      </TopMeta>
    </TopHeader>
  );
}
