import type { SiteMeta } from '../../content/site.types';

type Props = {
  meta: SiteMeta;
  brandOwlHtml: string;
};

export function SiteHeader({ meta, brandOwlHtml }: Props) {
  const words = meta.words.toLocaleString('ru-RU');
  const chapters = String(meta.numChapters).padStart(2, '0');

  return (
    <header className="top">
      <a className="brand" href="#top" aria-label="Carelink">
        <span dangerouslySetInnerHTML={{ __html: brandOwlHtml }} />
        <span className="bt">
          <b>Carelink</b>
          <small>Спокойная забота</small>
        </span>
      </a>
      <nav className="top-nav mono" aria-label="Разделы">
        <a href="#agenda">Повестка</a>
        <a href="#glavy-manifest">Главы</a>
        <a href="#cennosti">Ценности</a>
        <a href="#navyki">Навыки</a>
        <a href="#razrabotka">Разработка</a>
        <a href="#product-arch">Архитектура</a>
        <a href="#top">Лонгрид</a>
      </nav>
      <span className="mono top-l">Манифест · живой лонгрид</span>
      <a className="top-cta mono" href="#glavy-manifest">
        <span>К главам</span>
        <span className="top-cta-arrow" aria-hidden="true">
          →
        </span>
      </a>
      <span className="mono top-r">
        {words} слов · {chapters} глав
      </span>
    </header>
  );
}
