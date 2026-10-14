import type { SitePayload } from '../../content/site.types';

type Props = {
  article: SitePayload['article'];
  tocItems: { n: number; title: string }[];
};

export function ArticleLayout({ article, tocItems }: Props) {
  return (
    <div className="layout">
      <nav className="toc" aria-label="Оглавление">
        <span className="mono">Содержание</span>
        <ol>
          {tocItems.map((item) => (
            <li key={item.n}>
              <a href={`#glava-${item.n}`}>
                <span className="mono">{String(item.n).padStart(2, '0')}</span>
                {item.title}
              </a>
            </li>
          ))}
          <li>
            <a href="#sources">
              <span className="mono">··</span>
              Об источниках
            </a>
          </li>
        </ol>
      </nav>
      <article className="article read-stream">
        <div className="read-lead" dangerouslySetInnerHTML={{ __html: article.introHtml }} />
        <div className="read-chapters" dangerouslySetInnerHTML={{ __html: article.chapterHtml }} />
        <div className="read-tail" dangerouslySetInnerHTML={{ __html: article.sourcesHtml }} />
      </article>
    </div>
  );
}
