import type { Structured } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';
import { GlossaryList, GlossaryTitle, LandingGlossary } from './Glossary.styles';

type Props = {
  items: Structured['glossary'];
};

export function Glossary({ items }: Props) {
  return (
    <LandingGlossary data-reveal aria-label="Короткий словарь">
      <GlossaryTitle>Пять слов, которые встретятся дальше</GlossaryTitle>
      <GlossaryList>
        {items.map((row) => (
          <li key={row.term}>
            <dfn>{row.term}</dfn> —{' '}
            <span dangerouslySetInnerHTML={{ __html: inlineHtml(row.definition) }} />
          </li>
        ))}
      </GlossaryList>
    </LandingGlossary>
  );
}
