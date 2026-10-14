import type { ReactNode } from 'react';
import { inlineHtml } from '../../lib/inlineHtml';
import {
  NarrativeIntroInner,
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
  /** Adds seam styling before the agenda scroll stage */
  beforeAgenda?: boolean;
  /** Public path, e.g. images/agenda/… */
  backgroundImage?: string;
};

export function NarrativeIntro({
  h2,
  text,
  sectionId,
  extra,
  skipHref,
  skipLabel,
  beforeAgenda,
  backgroundImage,
}: Props) {
  return (
    <NarrativeIntroSection
      id={sectionId}
      data-reveal
      $beforeAgenda={beforeAgenda}
      $backgroundImage={backgroundImage}
    >
      <NarrativeIntroInner>
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
      </NarrativeIntroInner>
    </NarrativeIntroSection>
  );
}

/** Re-export for ChaptersScroll intro note and agenda format rail */
export {
  AgendaFormatRail,
  AgendaFormatStep,
  NarrativeNote,
} from './NarrativeIntro.styles';
