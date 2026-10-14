import type { SitePayload } from '../../content/site.types';
import {
  ArticleLayoutRoot,
  ArticleMain,
  ArticleToc,
  ReadChapters,
  ReadLead,
  ReadTail,
} from './ArticleLayout.styles';

type Props = {
  article: SitePayload['article'];
  tocItems: { n: number; title: string }[];
};

export function ArticleLayout({ article, tocItems }: Props) {
  return (
    <ArticleLayoutRoot>
      <ArticleToc aria-label="Оглавление">
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
      </ArticleToc>
      <ArticleMain>
        <ReadLead dangerouslySetInnerHTML={{ __html: article.introHtml }} />
        <ReadChapters dangerouslySetInnerHTML={{ __html: article.chapterHtml }} />
        <ReadTail dangerouslySetInnerHTML={{ __html: article.sourcesHtml }} />
      </ArticleMain>
    </ArticleLayoutRoot>
  );
}
