import type { Structured } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';
import { TruthLayerBody, TruthLayerSection, TruthLayerTitle } from './TruthLayer.styles';

type Props = {
  truth: Structured['truth'];
};

export function TruthLayer({ truth }: Props) {
  return (
    <TruthLayerSection id="manifest-truth" data-reveal aria-labelledby="truth-layer-title">
      <TruthLayerTitle id="truth-layer-title">{truth.heading}</TruthLayerTitle>
      <TruthLayerBody dangerouslySetInnerHTML={{ __html: inlineHtml(truth.body) }} />
    </TruthLayerSection>
  );
}
