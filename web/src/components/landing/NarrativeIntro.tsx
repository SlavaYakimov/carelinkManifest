import type { ReactNode } from 'react';
import { inlineHtml } from '../../lib/inlineHtml';
import {
  NarrativeIntroSection,
  NarrativeSkip,
} from './NarrativeIntro.styles';

type Props = {
  h2: string;
  text: string;
  sectionId?: string;
  extra?: ReactNode;
  skipHref?: string;
  skipLabel?: string;
};

export function NarrativeIntro({
  h2,
  text,
  sectionId,
  extra,
  skipHref,
  skipLabel,
}: Props) {
  return (
    <NarrativeIntroSection id={sectionId} data-reveal>
      <h2>{h2}</h2>
      <p dangerouslySetInnerHTML={{ __html: inlineHtml(text) }} />
      {extra}
      {skipHref ? (
        <NarrativeSkip>
          <a href={skipHref}>
            {skipLabel || 'Пропустить интерактивное листание — перейти к ценностям'}
          </a>
        </NarrativeSkip>
      ) : null}
    </NarrativeIntroSection>
  );
}

/** Re-export for ChaptersScroll intro note */
export { NarrativeNote } from './NarrativeIntro.styles';
