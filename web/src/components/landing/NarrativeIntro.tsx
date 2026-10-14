import type { ReactNode } from 'react';
import { inlineHtml } from '../../lib/inlineHtml';

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
    <section className="narrative-intro" id={sectionId} data-reveal>
      <h2>{h2}</h2>
      <p dangerouslySetInnerHTML={{ __html: inlineHtml(text) }} />
      {extra}
      {skipHref ? (
        <p className="narrative-intro__skip">
          <a href={skipHref}>
            {skipLabel || 'Пропустить интерактивное листание — перейти к ценностям'}
          </a>
        </p>
      ) : null}
    </section>
  );
}
