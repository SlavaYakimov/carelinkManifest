import type { Structured } from '../../content/site.types';
import { inlineHtml } from '../../lib/inlineHtml';
import {
  SkillsCard,
  SkillsCardBody,
  SkillsCardImg,
  SkillsGrid,
  SkillsIn,
  SkillsLead,
  SkillsSectionRoot,
  SkillsSlug,
} from './SkillsSection.styles';

type Props = {
  data: Structured['skills'];
};

export function SkillsSection({ data }: Props) {
  return (
    <SkillsSectionRoot id="navyki" aria-labelledby="navyki-title">
      <SkillsIn data-reveal>
        <p className="section-label">Память проекта</p>
        <h2 id="navyki-title">{data.title}</h2>
        <SkillsLead dangerouslySetInnerHTML={{ __html: inlineHtml(data.lead || '') }} />
        <SkillsGrid>
          {data.items.map((item) => (
            <SkillsCard key={item.id}>
              {item.image ? (
                <SkillsCardImg src={item.image} alt={item.title} loading="lazy" />
              ) : null}
              <SkillsCardBody>
                <SkillsSlug>{item.slug || ''}</SkillsSlug>
                <h3>{item.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: inlineHtml(item.teaser || '') }} />
                <button
                  type="button"
                  className="agenda-mini-read"
                  data-detail-open={item.id}
                  aria-label="Прочитать навык"
                >
                  →
                </button>
              </SkillsCardBody>
            </SkillsCard>
          ))}
        </SkillsGrid>
      </SkillsIn>
    </SkillsSectionRoot>
  );
}
