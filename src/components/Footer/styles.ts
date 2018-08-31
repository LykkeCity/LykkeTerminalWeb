import {rem} from 'polished';
import styled, {fonts} from '../styled';

// tslint:disable-next-line:no-var-requires
const {Box} = require('grid-styled');

export const FooterWrapper = styled.footer`
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
  padding: 0 ${rem(11)};
  border-bottom: solid 1px #292929;
  background: #333;
`;

export const FooterItem = styled(Box)`
  font-size: ${rem(fonts.normal)};
  position: relative;

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
