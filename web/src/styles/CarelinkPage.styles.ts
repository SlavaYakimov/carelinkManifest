import styled from 'styled-components';
import { theme } from './theme';

export const CarelinkPage = styled.div.attrs({ className: 'carelink-page' })`
  background: #f6f1e6;
  color: ${theme.colors.mut};
  overflow-x: clip;
  --bronze: var(--bronze-ink);
`;
