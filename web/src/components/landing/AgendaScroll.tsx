import type { Structured } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';
import { buildAgendaBundles, chainTitle } from '../../lib/agendaModel';
import {
  AgendaFormatRail,
  AgendaFormatStep,
  NarrativeIntro,
  NarrativeNote,
} from './NarrativeIntro';
import { ScrollStageHint } from './ChaptersScroll.styles';
import { BundleMini } from './BundleMini';
import {
  BundleArrow,
  BundleCard,
  BundleCardMinis,
  BundleNavButton,
  BundlePanel,
  BundlePanelChain,
  BundlePanelHeading,
  BundleProgress,
  BundleScroll,
  BundleStage,
  BundleTrack,
  BundleViewport,
} from './AgendaScroll.styles';

const KIND_LABEL: Record<string, string> = {
  vyzov: 'Вызов',
  scenario: 'Сценарий',
  reshenie: 'Решение',
};

type Props = {
  agenda: Structured['agenda'];
};

export function AgendaScroll({ agenda }: Props) {
  const bundles = buildAgendaBundles(agenda);

  return (
    <>
      <NarrativeIntro
        h2={agenda.intro_h2}
        text={agenda.intro_text}
        sectionId="agenda-intro"
        beforeAgenda
        backgroundImage={agenda.intro_bg}
        extra={
          <>
            <AgendaFormatRail>
              <AgendaFormatStep>
                <b>Вызов</b>
                <span>Разрыв, который называем проблемой</span>
              </AgendaFormatStep>
              <AgendaFormatStep>
                <b>Сценарий</b>
                <span>Вымысел — не факт и не озвучка бота</span>
              </AgendaFormatStep>
              <AgendaFormatStep>
                <b>Решение</b>
                <span>Ответ манифеста и Carelink</span>
              </AgendaFormatStep>
            </AgendaFormatRail>
            {agenda.intro_note ? (
              <NarrativeNote
                dangerouslySetInnerHTML={{ __html: inlineHtml(agenda.intro_note) }}
              />
            ) : null}
          </>
        }
        skipHref="#glavy-intro"
        skipLabel="Пропустить связки — к главам"
      />
      <BundleScroll id="agenda" aria-label="Carelink — вызовы, сценарии и решения">
        <BundleStage data-bundle-stage>
          <BundleViewport data-bundle-viewport>
            <ScrollStageHint $variant="desktop">Крутите страницу вниз</ScrollStageHint>
            <ScrollStageHint $variant="mobile">Листайте вбок</ScrollStageHint>
            <BundleTrack data-bundle-track>
              {bundles.map((bundle) => (
                <BundleCard key={bundle.num} tabIndex={0} data-bundle={bundle.num}>
                  <BundleCardMinis>
                    {bundle.minis.map((mini) => (
                      <BundleMini key={mini.cardId} mini={mini} />
                    ))}
                  </BundleCardMinis>
                </BundleCard>
              ))}
            </BundleTrack>
            <BundleArrow
              type="button"
              $variant="previous"
              data-bundle-prev
              aria-label="Предыдущая связка"
              disabled
            >
              ‹
            </BundleArrow>
            <BundleArrow
              type="button"
              $variant="next"
              data-bundle-next
              aria-label="Следующая связка"
            >
              ›
            </BundleArrow>
            <BundleProgress aria-hidden="true">
              <i data-bundle-progress />
            </BundleProgress>
          </BundleViewport>
          <BundlePanel>
            <BundlePanelHeading>
              <p>Carelink · Манифест</p>
              <h2>
                Вызовы <i>·</i> Сценарии <i>·</i> Решения
              </h2>
            </BundlePanelHeading>
            <nav aria-label="Связки повестки">
              <ol data-bundle-nav>
                {bundles.map((bundle) => (
                  <li key={bundle.num} data-bundle-nav={bundle.num}>
                    <BundlePanelChain>
                      <span>{String(bundle.num).padStart(2, '0')}</span>
                      <div>
                        {bundle.minis.map((mini) => (
                          <BundleNavButton
                            key={mini.cardId}
                            type="button"
                            data-bundle-focus={bundle.num}
                            data-bundle-kind={mini.key}
                          >
                            <b>{KIND_LABEL[mini.key]}</b>
                            <strong>{chainTitle(bundle, mini.key, mini.title)}</strong>
                          </BundleNavButton>
                        ))}
                      </div>
                    </BundlePanelChain>
                  </li>
                ))}
              </ol>
            </nav>
          </BundlePanel>
        </BundleStage>
      </BundleScroll>
    </>
  );
}
