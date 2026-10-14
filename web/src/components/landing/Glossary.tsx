import type { Structured } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';
import {
  GlossaryDef,
  GlossaryEntry,
  GlossaryGrid,
  GlossaryList,
  GlossaryTerm,
  GlossaryTitle,
  LandingGlossary,
} from './Glossary.styles';

type Props = {
  items: Structured['glossary'];
  title?: string;
  /** `truth` — карточная сетка внутри блока «Две опоры» */
  layout?: 'inline' | 'truth';
  id?: string;
};

const DEFAULT_GLOSSARY_TITLE = 'Пять слов, которые встретятся дальше';

export function Glossary({
  items,
  title = DEFAULT_GLOSSARY_TITLE,
  layout = 'inline',
  id,
}: Props) {
  if (layout === 'truth') {
    return (
      <LandingGlossary
        $layout="truth"
        id={id}
        data-reveal
        aria-label="Короткий словарь перед повесткой"
      >
        <GlossaryTitle $layout="truth">{title}</GlossaryTitle>
        <GlossaryGrid>
          {items.map((row) => (
            <GlossaryEntry key={row.term}>
              <GlossaryTerm>{row.term}</GlossaryTerm>
              <GlossaryDef dangerouslySetInnerHTML={{ __html: inlineHtml(row.definition) }} />
            </GlossaryEntry>
          ))}
        </GlossaryGrid>
      </LandingGlossary>
    );
  }

  return (
    <LandingGlossary data-reveal aria-label="Короткий словарь">
      <GlossaryTitle>{title}</GlossaryTitle>
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
