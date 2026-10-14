import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const SkillsSectionRoot = styled.section.attrs({
  className: 'skills-section',
})`
  background: ${theme.colors.wash};
  border-top: 1px solid #d9b98a;
  padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem);
  padding-inline: max(${theme.sectionX}, 1rem);

  h2 {
    font: 700 1.5rem/1.2 ${theme.fonts.head};
    color: ${theme.colors.green};
    letter-spacing: -0.03em;
  }

  .mono {
    letter-spacing: 0.14em;
  }
`;

export const SkillsIn = styled.div.attrs({
  className: 'skills-in section-panel',
})``;

export const SkillsLead = styled.p.attrs({
  className: 'skills-lead',
})``;

export const SkillsGrid = styled.div.attrs({
  className: 'skills-grid',
})`
  display: grid;
  gap: 1rem;
  max-width: 720px;
  max-width: min(${theme.contentMax}, 100%);
  margin-inline: auto;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const SkillsCard = styled.article.attrs({
  className: 'skills-card',
})`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1rem;
  background: #e9dcc7;
  border-radius: ${theme.miraiRadius};
  padding: 1rem;
  border: 1px solid ${theme.miraiHairline};
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.65) inset;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;

    img {
      width: 100%;
      max-height: 140px;
      object-fit: cover;
      border-radius: 2px;
    }
  }

  .agenda-mini-read {
    min-width: 44px !important;
    min-height: 44px !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    box-sizing: border-box;
  }

  @media (hover: hover) and (pointer: fine) {
    .agenda-mini-read:hover {
      background: rgba(220, 239, 230, 0.95);
      border-color: ${theme.colors.green};
    }
  }
`;

export const SkillsCardImg = styled.img.attrs({
  className: 'skills-card-img',
})`
  filter: saturate(0.94) contrast(1.02);
`;

export const SkillsCardBody = styled.div.attrs({
  className: 'skills-card-body',
})``;

export const SkillsSlug = styled.span.attrs({
  className: 'mono skills-slug',
})``;
