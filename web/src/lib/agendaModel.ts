import type { AgendaBundle, Structured } from '../content/site.types';

const KIND_LABEL: Record<string, string> = {
  vyzov: 'Вызов',
  scenario: 'Сценарий',
  reshenie: 'Решение',
};

export function buildAgendaBundles(data: Structured['agenda']): AgendaBundle[] {
  return data.bundles.map((b) => {
    const n = b.num;
    const minis: AgendaBundle['minis'] = (
      [
        ['vyzov', 'vyzov'] as const,
        ['scenario', 'scenario'] as const,
        ['reshenie', 'reshenie'] as const,
      ] as const
    ).map(([kind, key]) => {
      const item = b[key];
      const label = item.label || `${KIND_LABEL[kind]} · ${String(n).padStart(2, '0')}`;
      return {
        key,
        cardId: `agenda-${n}-${key}`,
        label,
        title: item.title,
        description: item.description || '',
        image: item.image || '',
        fictionBadge: key === 'scenario',
      };
    });
    return { num: n, navSolutionTitle: b.nav_solution_title, minis };
  });
}

export function chainTitle(bundle: AgendaBundle, key: 'vyzov' | 'scenario' | 'reshenie', title: string) {
  if (key === 'reshenie' && bundle.navSolutionTitle) return bundle.navSolutionTitle;
  return title;
}
