import {rem} from 'polished';
import styled, {fonts} from '../styled';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

export const HeaderItem = styled(Box)`
  font-size: ${rem(fonts.small)};
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    height: 24px;
    margin-top: -12px;
    border-left: solid 1px ${props => props.theme.colors.headerItemSeparator};
  }
  &:first-child:after {
    border-left: 0;
  }
  > span,
  a {
    padding: ${rem(6)} ${rem(10)} ${rem(9)};
    margin: 0 ${rem(5)};
    border-radius: 4px;
    border: 0;
    display: block;
    cursor: pointer;
    &.active {
      background-color: ${props =>
        props.theme.colors.headerActiveItemBackground};
    }
  }
`;

export const HeaderWrapper = styled.header`
  padding: ${rem(9)} ${rem(11)};
  height: 50px;
  border-top: solid 1px ${props => props.theme.colors.headerBorder};
  border-bottom: solid 1px ${props => props.theme.colors.headerBorder};
  background: ${props => props.theme.colors.headerBackground};
`;

export const HeaderFlex = styled(Flex)`
  height: 100%;
`;
