import type { DetailCard } from '../content/site.types';
import {
  LandingCardModalBody,
  LandingCardSource,
  LandingCardStoreRoot,
} from './LandingCardStore.styles';

type Props = {
  cards: DetailCard[];
};

export function LandingCardStore({ cards }: Props) {
  return (
    <LandingCardStoreRoot id="landing-card-store" hidden aria-hidden="true">
      {cards.map((c) => (
        <LandingCardSource
          key={c.id}
          id={c.id}
          data-kicker={c.kicker}
          data-title={c.title}
        >
          <LandingCardModalBody dangerouslySetInnerHTML={{ __html: c.bodyHtml }} />
        </LandingCardSource>
      ))}
    </LandingCardStoreRoot>
  );
}
