import type { DetailCard } from '../content/site.types';

type Props = {
  cards: DetailCard[];
};

export function LandingCardStore({ cards }: Props) {
  return (
    <div id="landing-card-store" hidden aria-hidden="true">
      {cards.map((c) => (
        <article
          key={c.id}
          className="landing-card-source"
          id={c.id}
          data-kicker={c.kicker}
          data-title={c.title}
        >
          <div
            className="landing-card-modal-body landing-drawer-content"
            dangerouslySetInnerHTML={{ __html: c.bodyHtml }}
          />
        </article>
      ))}
    </div>
  );
}
