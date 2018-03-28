import {rem} from 'polished';
import styled, {colors} from '../styled';
import {Table} from '../Table';
// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

export const ShortcutSelection = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: calc(100% - ${rem(16)});
  padding: ${rem(16)} 0;
  margin: 0 ${rem(8)};
  text-align: left;
  color: ${colors.lightGrey};

  &:after {
    content: '';
    margin-left: 10px;
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
    border-top: 4px solid ${colors.lightGrey};
  }

  &.active {
    color: ${colors.white};
    box-shadow: inset 0 -3px 0 0 ${colors.blue};
  }
`;

export const ShortcutSelectionWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const ShortcutList = styled(Flex)`
  min-width: 410px;
  overflow: hidden;
  flex-wrap: nowrap;
  font-size: 14px;
`;

export const OtherShortcuts = styled.div`
  display: flex;
  align-items: center;
  width: 70px;
  margin-right: ${rem(8)};

  &:hover {
    cursor: pointer;
  }
`;

export const Shortcut = styled(OtherShortcuts)`
  display: flex;
  align-items: center;
  width: 70px;
  min-width: 0;
  margin: 0 ${rem(8)};
  padding: ${rem(16)} 0;
  color: ${colors.lightGrey};

  &.active {
    color: ${colors.white};
    box-shadow: inset 0 -3px 0 0 ${colors.blue};
  }

  &:not(:first-child) {
    justify-content: center;
  }
`;

export const TruncatedText = styled.p`
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const InstrumentTable = styled(Table)`
  width: calc(100% - ${rem(8 * 2)});
  margin: ${rem(8)};

  th,
  td {
    padding: ${rem(12)};
  }

  td:nth-child(2) {
    text-align: left;
  }

  tbody {
    tr {
      border-top: 1px solid ${colors.graphiteBorder};
      border-bottom: 1px solid ${colors.graphiteBorder};
    }
    tr:hover {
      background-color: ${colors.darkGraphite};
    }
  }
`;
