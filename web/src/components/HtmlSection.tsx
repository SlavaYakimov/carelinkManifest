import type { ElementType } from 'react';

type Props = {
  html: string;
  className?: string;
  as?: ElementType;
};

export function HtmlSection({ html, className, as: Tag = 'div' }: Props) {
  if (!html) return null;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
