import styled from 'styled-components';

export const SiteFoot = styled.footer.attrs({ className: 'foot' })``;

export const FootBrand = styled.a.attrs({ className: 'brand foot-brand' })``;

export const FootBrandText = styled.span.attrs({ className: 'bt' })``;

export const FootCopy = styled.p.attrs({ className: 'foot-copy mono' })``;

export const FootNav = styled.nav.attrs({ className: 'foot-nav mono' })`
  a {
    min-height: 44px;
    min-width: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding-inline: 8px;
    box-sizing: border-box;
  }
`;

export const FootNote = styled.span.attrs({ className: 'foot-note mono' })``;

export const FootBadge = styled.span.attrs({ className: 'badge' })``;
