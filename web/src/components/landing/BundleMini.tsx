import type { AgendaMini } from '../../content/site.types';
import {
  BundleMiniArticle,
  BundleMiniCopy,
  BundleMiniFiction,
  BundleMiniWash,
} from './BundleMini.styles';

type Props = {
  mini: AgendaMini;
};

export function BundleMini({ mini }: Props) {
  return (
    <BundleMiniArticle>
      <img
        src={mini.image}
        alt={mini.title}
        loading="lazy"
        width={640}
        height={480}
      />
      <BundleMiniWash aria-hidden="true" />
      <button
        type="button"
        aria-label={`Открыть карточку: ${mini.title}`}
        data-detail-open={mini.cardId}
      >
        →
      </button>
      <BundleMiniCopy>
        {mini.fictionBadge ? (
          <BundleMiniFiction>Вымышленный сценарий</BundleMiniFiction>
        ) : null}
        <p>{mini.label}</p>
        <h3>{mini.title}</h3>
      </BundleMiniCopy>
    </BundleMiniArticle>
  );
}
