import {rem} from 'polished';
import styled, {colors} from '../styled';
import {Table, TruncatedText} from '../Table';
// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

export const SearchWrap = styled(Flex)`
  border-bottom: solid 1px rgba(0, 0, 0, 0.2);
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
  color: ${colors.coolGrey};

  &:after {
    content: '';
    margin: 0 10px;
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
    border-top: 4px solid ${colors.coolGrey};
  }

  &.active {
    color: ${colors.white};

    > * {
      box-shadow: inset 0 -3px 0 0 ${colors.blue};
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
  color: ${colors.coolGrey};
  justify-content: center;

  &.active > * {
    color: ${colors.white};
    box-shadow: inset 0 -3px 0 0 ${colors.blue};
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
  font-family: Lekton, monospace;
  font-weight: bold;
  align-items: center;
  justify-content: flex-end;
  color: ${(p: any) => p.color};

  &.up {
    color: ${colors.green};
  }
  &.zero {
    color: ${colors.lightGrey};
  }
  &.down {
    color: ${colors.red};
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
    border-bottom: 7px solid ${colors.green};
  }
  &.down:after {
    border-top: 7px solid ${colors.red};
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
      border-bottom: 1px solid ${colors.graphiteBorder};

      &.active {
        background-color: ${colors.darkGraphite};
      }
      &.inactive:hover {
        cursor: pointer;
      }
      &:not(.active):hover {
        background-color: ${colors.darkGraphite};
      }
    }
  }
`;
