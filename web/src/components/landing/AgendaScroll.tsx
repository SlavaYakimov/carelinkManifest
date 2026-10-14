import type { Structured } from '../../content/site.types';
import { buildAgendaBundles, chainTitle } from '../../lib/agendaModel';
import { Glossary } from './Glossary';
import { NarrativeIntro } from './NarrativeIntro';
import { BundleMini } from './BundleMini';

const KIND_LABEL: Record<string, string> = {
  vyzov: 'Вызов',
  scenario: 'Сценарий',
  reshenie: 'Решение',
};

type Props = {
  agenda: Structured['agenda'];
  glossary: Structured['glossary'];
};

export function AgendaScroll({ agenda, glossary }: Props) {
  const bundles = buildAgendaBundles(agenda);

  return (
    <>
      <NarrativeIntro
        h2={agenda.intro_h2}
        text={agenda.intro_text}
        sectionId="agenda-intro"
        extra={<Glossary items={glossary} />}
        skipHref="#cennosti"
      />
      <section
        className="bundle-scroll"
        id="agenda"
        aria-label="Carelink — вызовы, сценарии и решения"
      >
        <div className="bundle-stage" data-bundle-stage>
          <div className="bundle-viewport" data-bundle-viewport>
            <div className="bundle-track" data-bundle-track>
              {bundles.map((bundle) => (
                <article
                  key={bundle.num}
                  className="bundle-card"
                  tabIndex={0}
                  data-bundle={bundle.num}
                >
                  <div className="bundle-card__minis">
                    {bundle.minis.map((mini) => (
                      <BundleMini key={mini.cardId} mini={mini} />
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="bundle-arrow bundle-arrow--previous"
              data-bundle-prev
              aria-label="Предыдущая связка"
              disabled
            >
              ‹
            </button>
            <button
              type="button"
              className="bundle-arrow bundle-arrow--next"
              data-bundle-next
              aria-label="Следующая связка"
            >
              ›
            </button>
            <div className="bundle-progress" aria-hidden="true">
              <i data-bundle-progress />
            </div>
          </div>
          <aside className="bundle-panel">
            <div className="bundle-panel__heading">
              <p>Carelink · Манифест</p>
              <h2>
                Вызовы <i>·</i> Сценарии <i>·</i> Решения
              </h2>
            </div>
            <nav aria-label="Связки повестки">
              <ol data-bundle-nav>
                {bundles.map((bundle) => (
                  <li key={bundle.num} data-bundle-nav={bundle.num}>
                    <div className="bundle-panel__chain">
                      <span>{String(bundle.num).padStart(2, '0')}</span>
                      <div>
                        {bundle.minis.map((mini) => (
                          <button
                            key={mini.cardId}
                            type="button"
                            data-bundle-focus={bundle.num}
                            data-bundle-kind={mini.key}
                          >
                            <b>{KIND_LABEL[mini.key]}</b>
                            <strong>{chainTitle(bundle, mini.key, mini.title)}</strong>
                          </button>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        </div>
      </section>
    </>
  );
}
