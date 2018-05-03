import {rem} from 'polished';
import styled from '../styled';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

export const HeaderItem = styled(Box)`
  font-size: ${rem(16)};
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    height: 24px;
    margin-top: -12px;
    border-left: solid 1px rgba(0, 0, 0, 0.2);
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
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
`;

export const HeaderWrapper = styled.header`
  padding: ${rem(9)} ${rem(11)};
  height: 60px;
  border-bottom: solid 1px #292929;
  background: #333;
`;

export const Logo = styled.div`
  margin-right: ${rem(18)};
`;

export const HeaderFlex = styled(Flex)`
  height: 100%;
`;
