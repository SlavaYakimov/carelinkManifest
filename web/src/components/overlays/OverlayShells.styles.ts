import styled from 'styled-components';
import { theme } from '../../styles/theme';

const dialogShell = `
  border-radius: ${theme.miraiRadius} !important;
  border: 1px solid ${theme.miraiHairline};
  box-shadow: ${theme.shadowSoft};
`;

export const DetailDialog = styled.dialog.attrs({ className: 'detail-dialog' })`
  ${dialogShell}
`;

export const DetailDialogPanel = styled.div.attrs({ className: 'detail-dialog-panel' })``;

export const DetailDialogHead = styled.header.attrs({ className: 'detail-dialog-head' })``;

export const DetailDialogKicker = styled.span.attrs({
  className: 'mono detail-dialog-kicker',
})``;

export const DetailDialogTitle = styled.h2.attrs({ className: 'detail-dialog-title' })`
  font-family: var(--head);
`;

export const DetailDialogClose = styled.button.attrs({
  className: 'detail-dialog-close chapter-dialog-close',
})`
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const DetailDialogBody = styled.div.attrs({
  className: 'detail-dialog-body landing-card-dialog-body',
})``;

export const LandingDrawer = styled.div.attrs({ className: 'landing-drawer' })``;

export const LandingDrawerOverlay = styled.button.attrs({
  className: 'landing-drawer-overlay',
})``;

export const LandingDrawerSheet = styled.div.attrs({ className: 'landing-drawer-sheet' })``;

export const LandingDrawerHead = styled.header.attrs({ className: 'landing-drawer-head' })``;

export const LandingDrawerKicker = styled.span.attrs({
  className: 'mono landing-drawer-kicker',
})``;

export const LandingDrawerTitle = styled.h2.attrs({ className: 'landing-drawer-title' })``;

export const LandingDrawerClose = styled.button.attrs({
  className: 'landing-drawer-close chapter-dialog-close',
})``;

export const LandingDrawerBody = styled.div.attrs({
  className: 'landing-drawer-body landing-card-dialog-body',
})``;

export const ChapterDialog = styled.dialog.attrs({ className: 'chapter-dialog' })``;

export const ChapterDialogPanel = styled.div.attrs({ className: 'chapter-dialog-panel' })``;

export const ChapterDialogHead = styled.header.attrs({ className: 'chapter-dialog-head' })``;

export const ChapterDialogKicker = styled.span.attrs({
  className: 'mono chapter-dialog-kicker',
})``;

export const ChapterDialogTitle = styled.h2.attrs({ className: 'chapter-dialog-title' })``;

export const ChapterDialogClose = styled.button.attrs({ className: 'chapter-dialog-close' })``;

export const ChapterDialogBody = styled.div.attrs({ className: 'chapter-dialog-body' })``;

export const ChapterTabs = styled.div.attrs({ className: 'chapter-tabs' })``;

export const ChapterTablist = styled.div.attrs({ className: 'chapter-tablist' })``;

export const ChapterTabpanel = styled.div.attrs({ className: 'chapter-tabpanel' })``;

export const ChapterDialogFoot = styled.footer.attrs({ className: 'chapter-dialog-foot' })``;

export const BtnNav = styled.button.attrs({ className: 'btn-nav' })``;
