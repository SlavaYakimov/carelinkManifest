import type { Structured } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';

type Props = {
  items: Structured['glossary'];
};

export function Glossary({ items }: Props) {
  return (
    <aside className="landing-glossary" data-reveal aria-label="Короткий словарь">
      <h3 className="landing-glossary__title">Пять слов, которые встретятся дальше</h3>
      <ul className="landing-glossary__list">
        {items.map((row) => (
          <li key={row.term}>
            <dfn>{row.term}</dfn> —{' '}
            <span dangerouslySetInnerHTML={{ __html: inlineHtml(row.definition) }} />
          </li>
        ))}
      </ul>
    </aside>
  );
}
