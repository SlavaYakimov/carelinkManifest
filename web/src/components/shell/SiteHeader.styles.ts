import styled from 'styled-components';

export const TopHeader = styled.header.attrs({ className: 'top' })``;

export const BrandLink = styled.a.attrs({ className: 'brand' })``;

export const BrandText = styled.span.attrs({ className: 'bt' })``;

export const TopNav = styled.nav.attrs({ className: 'top-nav mono' })`
  a {
    min-width: 44px;
    justify-content: center;
    padding-inline: 10px;
  }
`;

export const TopLabel = styled.span.attrs({ className: 'mono top-l' })``;

export const TopCta = styled.a.attrs({ className: 'top-cta mono' })``;

export const TopCtaArrow = styled.span.attrs({ className: 'top-cta-arrow' })``;

export const TopMeta = styled.span.attrs({ className: 'mono top-r' })``;
