import {lighten, rem} from 'polished';
import styled, {css} from '../styled';

// tslint:disable-next-line:no-var-requires
const {Box} = require('grid-styled');

const iconCss = css`
  i {
    cursor: pointer;
    color: #d8d8d8;
    &:hover {
      color: ${lighten(0.2)('#d8d8d8')};
    }
  }
`;

const TileMenu = styled(Box)`
  border-right: none;
  border-left: solid 1px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  margin: ${rem(5)} 0;
  padding: ${rem(5)} ${rem(15)};
  ${iconCss};
`;

export default TileMenu;
