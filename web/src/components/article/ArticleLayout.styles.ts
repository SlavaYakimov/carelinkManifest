import styled from 'styled-components';

export const ArticleLayoutRoot = styled.div.attrs({ className: 'layout' })`
  max-width: 100%;
`;

export const ArticleToc = styled.nav.attrs({ className: 'toc' })``;

export const ArticleMain = styled.article.attrs({ className: 'article read-stream' })``;

export const ReadLead = styled.div.attrs({ className: 'read-lead' })``;

export const ReadChapters = styled.div.attrs({ className: 'read-chapters' })``;

export const ReadTail = styled.div.attrs({ className: 'read-tail' })``;
