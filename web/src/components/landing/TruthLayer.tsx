import type { Structured, TruthScaleKey } from '../../content/site.types';
import { Glossary } from './Glossary';
import {
  PillarIndex,
  PillarList,
  PillarMeta,
  PillarScale,
  PillarSummary,
  PillarTitle,
  ScaleLegendDesc,
  ScaleLegendHead,
  ScaleLegendItem,
  ScaleLegendTitle,
  TruthGlossaryWrap,
  TruthLayerHeader,
  TruthLayerInner,
  TruthLayerLead,
  TruthLayerSection,
  TruthLayerTitle,
  TruthPillarCard,
  TruthPillars,
  TruthScaleLegend,
  TruthSupportItem,
  TruthSupports,
} from './TruthLayer.styles';

const SCALE_SHORT: Record<TruthScaleKey, string> = {
  now: 'Уже сейчас',
  roadmap: 'Дорожная карта',
  language: 'Язык',
};

type Props = {
  truth: Structured['truth'];
  glossary: Structured['glossary'];
};

export function TruthLayer({ truth, glossary }: Props) {
  return (
    <TruthLayerSection id="manifest-truth" data-reveal aria-labelledby="truth-layer-title">
      <TruthLayerInner>
        <TruthLayerHeader>
          <TruthLayerTitle id="truth-layer-title">{truth.heading}</TruthLayerTitle>
          <TruthLayerLead>{truth.lead}</TruthLayerLead>
        </TruthLayerHeader>

        <TruthSupports aria-label="Две опоры Carelink">
          {truth.supports.map((item) => (
            <TruthSupportItem key={item.label}>
              <strong>{item.label}</strong>
              {item.detail}
            </TruthSupportItem>
          ))}
        </TruthSupports>

        <TruthPillars aria-label="Три угла, как во вкладках hero">
          {truth.pillars.map((pillar, index) => (
            <TruthPillarCard
              key={pillar.id}
              id={`truth-pillar-${pillar.id}`}
              data-hero-tab={pillar.id}
              data-reveal
            >
              <PillarMeta>
                <PillarIndex aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </PillarIndex>
                <PillarScale $scale={pillar.scale}>{SCALE_SHORT[pillar.scale]}</PillarScale>
              </PillarMeta>
              <PillarTitle>{pillar.title}</PillarTitle>
              <PillarSummary>{pillar.summary}</PillarSummary>
              <PillarList>
                {pillar.bullets.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </PillarList>
            </TruthPillarCard>
          ))}
        </TruthPillars>

        <TruthScaleLegend aria-label="Шкала обещаний">
          {truth.scaleLegend.map((row) => (
            <ScaleLegendItem key={row.key}>
              <ScaleLegendHead>
                <ScaleLegendTitle>{row.title}</ScaleLegendTitle>
                {row.key === 'roadmap' ? (
                  <span className="badge" title="Не обещание ближайшего релиза">Концепт</span>
                ) : null}
              </ScaleLegendHead>
              <ScaleLegendDesc>{row.description}</ScaleLegendDesc>
            </ScaleLegendItem>
          ))}
        </TruthScaleLegend>

        <TruthGlossaryWrap>
          <Glossary
            id="manifest-glossary"
            layout="truth"
            items={glossary}
            title="Словарь перед повесткой"
          />
        </TruthGlossaryWrap>
      </TruthLayerInner>
    </TruthLayerSection>
  );
}
