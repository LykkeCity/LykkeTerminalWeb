import {rem} from 'polished';
import styled, {colors} from '../styled';
// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

export const ShortcutSelection = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  padding: ${rem(16)} 0;
  margin-left: ${rem(8)};
  text-align: left;
  color: ${colors.lightGrey};

  &:after {
    content: '';
    margin: 0 10px;
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
`;

export const TruncatedText = styled.p`
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Header = styled.div`
  display: flex;
  border-bottom: solid 1px rgba(0, 0, 0, 0.2);
`;

export const TableHeaderItem = styled.div`
  display: flex;
  align-items: center;
  width: 25%;
  padding: ${rem(10)};
  color: ${colors.lightGrey};

  &.right-align {
    justify-content: flex-end;
  }
  &:after {
    content: '';
    margin-left: ${rem(10)};
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
  }
  &.ASC:after {
    border-bottom: 4px solid ${colors.lightGrey};
  }
  &.DESC:after {
    border-top: 4px solid ${colors.lightGrey};
  }
`;
