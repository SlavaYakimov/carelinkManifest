type Props = {
  brandOwlHtml: string;
};

export function SiteFooter({ brandOwlHtml }: Props) {
  return (
    <footer className="foot">
      <a className="brand foot-brand" href="#top">
        <span dangerouslySetInnerHTML={{ __html: brandOwlHtml }} />
        <span className="bt">
          <b>Carelink</b>
          <small>Спокойная забота</small>
        </span>
      </a>
      <p className="foot-copy mono">
        © 2026 Carelink · Слава Якимов
      </p>
      <nav className="foot-nav mono" aria-label="Разделы в подвале">
        <a href="#agenda">Повестка</a>
        <a href="#glavy-manifest">Главы</a>
        <a href="#cennosti">Ценности</a>
        <a href="#navyki">Навыки</a>
        <a href="#top">Наверх</a>
      </nav>
      <span className="foot-note mono">
        <span className="badge">Концепт</span> — ещё обсуждается
      </span>
    </footer>
  );
}
