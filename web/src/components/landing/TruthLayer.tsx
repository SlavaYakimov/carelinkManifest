import type { Structured } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';

type Props = {
  truth: Structured['truth'];
};

export function TruthLayer({ truth }: Props) {
  return (
    <section
      className="truth-layer"
      id="manifest-truth"
      data-reveal
      aria-labelledby="truth-layer-title"
    >
      <h2 id="truth-layer-title" className="truth-layer__title">
        {truth.heading}
      </h2>
      <p
        className="truth-layer__body"
        dangerouslySetInnerHTML={{ __html: inlineHtml(truth.body) }}
      />
    </section>
  );
}
