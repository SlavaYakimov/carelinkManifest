import { inlineHtml } from '../../lib/inlineHtml';
import { teaserFromText } from '../../lib/teaser';

type ChallengeProblem = {
  title: string;
  description: string;
  image?: string;
  response?: string;
};

type ChallengeExample = {
  title: string;
  body: string;
  image?: string;
};

type FeaturedSolution = {
  title: string;
  problem_ref: string;
  description: string;
  image?: string;
};

type ChallengesData = {
  intro: string;
  solutions_intro?: string;
  solutions_detail_lbl?: string;
  examples_note?: string;
  problems: ChallengeProblem[];
  examples: ChallengeExample[];
  featured_solutions?: FeaturedSolution[];
};

type Props = {
  data: ChallengesData;
};

function LandingTicket({
  cardId,
  kicker,
  title,
  teaser,
  image,
  imageAlt,
}: {
  cardId: string;
  kicker: string;
  title: string;
  teaser: string;
  image?: string;
  imageAlt?: string;
}) {
  const aria = teaser ? `${title} — ${teaser}` : title;
  return (
    <li className="chapter-grid-cell landing-ticket-cell">
      <button
        type="button"
        className="chapter-grid-card chapter-grid-card--ticket mirai-ticket landing-card-ticket"
        data-landing-card={cardId}
        aria-label={aria}
      >
        <span className="mono landing-card-kicker">{kicker}</span>
        <h3 className="landing-card-title">{title}</h3>
        {teaser ? (
          <p
            className="landing-card-teaser"
            dangerouslySetInnerHTML={{ __html: inlineHtml(teaser) }}
          />
        ) : null}
        {image ? (
          <figure className="chapter-grid-media landing-card-media">
            <img src={image} alt={imageAlt || title} loading="lazy" className="chapter-grid-img" />
          </figure>
        ) : null}
        <footer className="mirai-ticket__foot landing-card-cta" aria-hidden="true">
          <span className="landing-card-read mirai-ticket__pill">Прочитать</span>
          <span className="landing-card-cta-hint mirai-ticket__meta">панель справа</span>
        </footer>
      </button>
    </li>
  );
}

export function ChallengesSection({ data }: Props) {
  const nProb = data.problems.length;
  const nEx = data.examples.length;
  const featured = data.featured_solutions || [];
  const nFeat = featured.length;

  return (
    <>
      <section className="challenges" id="vyzovy" aria-labelledby="challenges-title">
        <div className="challenges-in section-panel" data-reveal>
          <p className="section-label">Вызовы</p>
          <h2 id="challenges-title" className="challenges-title">Проблемы семьи</h2>
          <p
            className="challenges-intro"
            dangerouslySetInnerHTML={{ __html: inlineHtml(data.intro) }}
          />
          <h3 className="mono landing-card-grid-lbl">Выберите проблему · {nProb} карточек</h3>
          <ol className="chapter-grid ticket-grid landing-card-grid landing-card-grid--problems">
            {data.problems.map((p, i) => (
              <LandingTicket
                key={`problem-${i + 1}`}
                cardId={`problem-${i + 1}`}
                kicker={`Проблема · ${String(i + 1).padStart(2, '0')}/${String(nProb).padStart(2, '0')}`}
                title={p.title}
                teaser={teaserFromText(p.description)}
                image={p.image}
                imageAlt={p.title}
              />
            ))}
          </ol>
          <div className="challenge-examples">
            <span className="mono challenges-examples-lbl">Сценарии</span>
            {data.examples_note ? (
              <p
                className="challenges-examples-note"
                dangerouslySetInnerHTML={{ __html: inlineHtml(data.examples_note) }}
              />
            ) : null}
            <h3 className="mono landing-card-grid-lbl">Выберите сценарий · {nEx} карточек</h3>
            <ol className="chapter-grid ticket-grid landing-card-grid landing-card-grid--scenarios">
              {data.examples.map((ex, i) => (
                <LandingTicket
                  key={`scenario-${i + 1}`}
                  cardId={`scenario-${i + 1}`}
                  kicker={`Сценарий · ${String(i + 1).padStart(2, '0')}/${String(nEx).padStart(2, '0')}`}
                  title={ex.title}
                  teaser={teaserFromText(ex.body)}
                  image={ex.image}
                  imageAlt={ex.title}
                />
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="solutions" id="resheniya" aria-labelledby="solutions-title">
        <div className="solutions-in section-panel" data-reveal>
          <p className="section-label">Решения</p>
          <h2 id="solutions-title" className="solutions-title">Решения</h2>
          {data.solutions_intro ? (
            <p
              className="solutions-intro"
              dangerouslySetInnerHTML={{ __html: inlineHtml(data.solutions_intro) }}
            />
          ) : null}
          <p className="solutions-lead">
            Каждая карточка — один способ из манифеста. Нажмите «Прочитать» — справа откроется панель с
            полным текстом и связью с проблемой.
          </p>
          {nFeat > 0 ? (
            <>
              <h3 className="mono landing-card-grid-lbl">Три опоры · {nFeat} карточки</h3>
              <ol className="chapter-grid ticket-grid landing-card-grid landing-card-grid--solutions">
                {featured.map((f, i) => (
                  <LandingTicket
                    key={`solution-featured-${i + 1}`}
                    cardId={`solution-featured-${i + 1}`}
                    kicker={`Решение · ${String(i + 1).padStart(2, '0')}/${String(nFeat).padStart(2, '0')}`}
                    title={f.title}
                    teaser={teaserFromText(f.description)}
                    image={f.image}
                    imageAlt={f.title}
                  />
                ))}
              </ol>
            </>
          ) : null}
          {data.solutions_detail_lbl ? (
            <p className="mono solutions-detail-lbl">{data.solutions_detail_lbl}</p>
          ) : null}
          <ol className="solution-list solution-list--detail">
            {data.problems.map((p, i) => (
              <li key={p.title} className="solution-item">
                <span className="mono solution-num">{String(i + 1).padStart(2, '0')}</span>
                <div className="solution-body">
                  <h3 className="solution-for">{p.title}</h3>
                  {p.response ? (
                    <p
                      className="solution-text"
                      dangerouslySetInnerHTML={{ __html: inlineHtml(p.response) }}
                    />
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
