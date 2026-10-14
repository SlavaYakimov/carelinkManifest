import type { AgendaMini } from '../../content/site.types';

type Props = {
  mini: AgendaMini;
};

export function BundleMini({ mini }: Props) {
  return (
    <article className="bundle-mini">
      <img
        src={mini.image}
        alt={mini.title}
        loading="lazy"
        width={640}
        height={480}
      />
      <div className="bundle-mini__wash" aria-hidden="true" />
      <button
        type="button"
        aria-label={`Открыть карточку: ${mini.title}`}
        data-detail-open={mini.cardId}
      >
        →
      </button>
      <div className="bundle-mini__copy">
        {mini.fictionBadge ? (
          <span className="bundle-mini__fiction">Вымышленный сценарий</span>
        ) : null}
        <p>{mini.label}</p>
        <h3>{mini.title}</h3>
      </div>
    </article>
  );
}
