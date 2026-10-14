import type { Structured } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';
import { NarrativeIntro } from './NarrativeIntro';

type Props = {
  data: Structured['chaptersLanding'];
  introNote: string;
};

export function ChaptersScroll({ data, introNote }: Props) {
  const chapters = data.chapters;
  const perSet = 4;
  const sets = Math.ceil(chapters.length / perSet);
  const panelLead =
    'Манифест — это не правила, а разговор о том, как близким оставаться рядом.';

  return (
    <>
      <NarrativeIntro
        h2={data.intro_h2}
        text={data.intro_text}
        sectionId="glavy-intro"
        extra={
          introNote ? (
            <p
              className="narrative-intro__note"
              dangerouslySetInnerHTML={{ __html: inlineHtml(introNote) }}
            />
          ) : null
        }
        skipHref="#top"
        skipLabel="Пропустить интерактивный обзор глав — перейти к лонгриду"
      />
      <section
        className="chapters-scroll"
        id="glavy-manifest"
        style={{ ['--chapter-sets' as string]: sets }}
        aria-labelledby="chapters-title"
      >
        <div className="chapters-stage" data-chapters-stage>
          <div className="chapters-viewport" data-chapters-viewport>
            <div
              className="chapters-sets"
              data-chapters-sets
              style={{ ['--chapters-progress' as string]: 0 }}
            >
              {Array.from({ length: sets }, (_, si) => {
                const chunk = chapters.slice(si * perSet, (si + 1) * perSet);
                const setHidden = si === 0 ? 'false' : 'true';
                return (
                  <div
                    key={si}
                    className="chapters-set"
                    style={{ ['--chapter-set-index' as string]: si }}
                    aria-hidden={setHidden}
                  >
                    {chunk.map((ch) => {
                      const n = ch.num;
                      const cid = `chapter-poster-${n}`;
                      const active = si === 0;
                      return (
                        <article
                          key={n}
                          className="chapter-card"
                          tabIndex={active ? 0 : -1}
                          {...(active ? { role: 'button' as const } : {})}
                          data-chapter-card={n}
                          data-detail-open={cid}
                          aria-hidden={active ? undefined : 'true'}
                          aria-label={`Открыть главу: ${ch.title}`}
                        >
                          <img src={ch.image || ''} alt={ch.title} loading="lazy" />
                          <div className="chapter-card__shade" aria-hidden="true" />
                          <div className="chapter-card__copy">
                            <p>{`Глава · ${String(n).padStart(2, '0')}/20`}</p>
                            <h3>{ch.title}</h3>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: inlineHtml(ch.teaser || ch.subtitle),
                              }}
                            />
                          </div>
                        </article>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <aside className="chapters-panel">
            <div className="chapters-panel__mobile" data-chapters-mobile>
              <span data-chapters-mobile-range>01–04 / 20</span>
              <strong data-chapters-mobile-title>{chapters[0]?.title}</strong>
              <span className="scroll-stage-hint scroll-stage-hint--desktop">
                Крутите страницу вниз
              </span>
              <span className="scroll-stage-hint scroll-stage-hint--mobile">
                Листайте вбок
              </span>
            </div>
            <div className="chapters-panel__heading">
              <p>{panelLead}</p>
              <h2 id="chapters-title">Главы</h2>
              <div data-chapters-desktop-range>
                <span>01–04</span>
                <i />
                <span>20</span>
              </div>
            </div>
            <nav aria-label="Главы манифеста">
              <ol data-chapters-nav>
                {chapters.map((ch) => (
                  <li key={ch.num} data-chapter-nav={ch.num}>
                    <button type="button" data-chapter-goto={ch.num}>
                      <span>{String(ch.num).padStart(2, '0')}</span>
                      <strong>{ch.title}</strong>
                    </button>
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
