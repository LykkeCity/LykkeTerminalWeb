import {rem} from 'polished';
import styled from '../styled';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

export const HeaderItem = styled(Box)`
  border-left: solid 1px rgba(0, 0, 0, 0.2);
  font-size: ${rem(14)};
  /* height: 26px; */

  &:first-child {
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
  height: 50px;
  border-bottom: solid 1px #292929;
  background: #333;
`;

export const Logo = styled.div`
  margin-right: ${rem(18)};
`;

export const HeaderFlex = styled(Flex)`
  height: 100%;
`;
