import {rem} from 'polished';
import styled from '../styled';
import {Table, TruncatedText} from '../Table';
// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

export const SearchWrap = styled(Flex)`
  border-bottom: solid 1px ${props => props.theme.colors.tabsHeaderBorder};
`;

export const ShortcutSelectionWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const ShortcutSelection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  margin-left: ${rem(8)};
  color: ${props => props.theme.colors.inactiveItemText};

  &:after {
    content: '';
    margin: 0 10px;
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
    border-top: 4px solid ${props => props.theme.colors.tableHeaderSortIcon};
  }

  &.active {
    color: ${props => props.theme.colors.activeItemText};

    > * {
      box-shadow: inset 0 -3px 0 0 ${props => props.theme.colors.activeItemBorder};
    }
  }
`;

export const ShortcutList = styled(Flex)`
  overflow: hidden;
  flex-wrap: nowrap;
  font-size: 14px;
`;

export const OtherShortcuts = styled.div`
  display: flex;
  align-items: center;
  width: 70px;
  margin-right: ${rem(4)};

  &:hover {
    cursor: pointer;
  }
`;

export const Shortcut = styled(OtherShortcuts)`
  min-width: 0;
  margin: 0 ${rem(8)};
  color: ${props => props.theme.colors.inactiveItemText};
  justify-content: center;

  &.active > * {
    color: ${props => props.theme.colors.activeItemText};
    box-shadow: inset 0 -3px 0 0 ${props => props.theme.colors.activeItemBorder};
  }
  &:first-child {
    margin: 0 ${rem(8)} 0 0;
    justify-content: flex-start;
  }
`;

export const ShortcutTruncatedText = styled(TruncatedText)`
  padding: ${rem(16)} 0;
`;

export const InstrumentNumber = styled.div.attrs({})`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${(p: any) => p.color};

  &.up {
    color: ${props => props.theme.colors.changePositivePerformanceText};
  }
  &.zero {
    color: ${props => props.theme.colors.zeroNumberText};
  }
  &.down {
    color: ${props => props.theme.colors.changeNegativePerformanceText};
  }
  &.up,
  &.down {
    &:after {
      content: '';
      margin-left: 5px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
    }
  }
  &.up:after {
    border-bottom: 7px solid
      ${props => props.theme.colors.changePositivePerformanceText};
  }
  &.down:after {
    border-top: 7px solid
      ${props => props.theme.colors.changeNegativePerformanceText};
  }
`;

export const InstrumentTableEl = styled(Table)`
  th,
  td {
    padding: ${rem(10)} ${rem(12)};

    &:first-child {
      padding-left: ${rem(8)};
    }
    &:nth-child(2) > div {
      justify-content: flex-start;
    }
    &:last-child {
      padding-right: ${rem(8)};
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid ${props => props.theme.colors.tableRowBorder};

      &.active {
        background-color: ${props =>
          props.theme.colors.headerActiveItemBackground};
      }
      &.inactive:hover {
        cursor: pointer;
      }
      &:not(.active):hover {
        background-color: ${props =>
          props.theme.colors.headerActiveItemBackground};
      }
    }
  }
`;
