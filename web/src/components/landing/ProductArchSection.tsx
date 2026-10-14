import { inlineHtml } from '../../lib/inlineHtml';

type ArchItem = {
  title: string;
  description: string;
  note?: '' | 'direction' | 'partial';
};

type ArchData = {
  intro: string;
  items: ArchItem[];
};

function archBadge(note: ArchItem['note']) {
  if (note === 'direction') {
    return (
      <span
        className="badge product-arch-badge product-arch-badge--direction"
        title="Направление, не подтверждённый релиз v1"
      >
        требует подтверждения
      </span>
    );
  }
  if (note === 'partial') {
    return (
      <span
        className="badge product-arch-badge product-arch-badge--partial"
        title="Частично описано в манифесте"
      >
        требует подтверждения
      </span>
    );
  }
  return null;
}

type Props = {
  data: ArchData;
};

export function ProductArchSection({ data }: Props) {
  return (
    <section className="product-arch" id="product-arch" aria-labelledby="product-arch-title">
      <div className="product-arch-in section-panel" data-reveal>
        <p className="section-label">Архитектура</p>
        <h2 id="product-arch-title" className="product-arch-title">Архитектура продукта</h2>
        <p
          className="product-arch-intro"
          dangerouslySetInnerHTML={{ __html: inlineHtml(data.intro) }}
        />
        <ol className="product-arch-list">
          {data.items.map((it, i) => (
            <li key={it.title} className="product-arch-item">
              <span className="mono product-arch-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="product-arch-body">
                {archBadge(it.note)}
                <h3 className="product-arch-title">{it.title}</h3>
                <p
                  className="product-arch-desc"
                  dangerouslySetInnerHTML={{ __html: inlineHtml(it.description) }}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
