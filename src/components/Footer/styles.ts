import {rem} from 'polished';
import styled, {fonts} from '../styled';

// tslint:disable-next-line:no-var-requires
const {Box} = require('grid-styled');

export const FooterWrapper = styled.footer`
  padding: ${rem(9)} ${rem(11)};
  height: 27px;
  border-bottom: solid 1px ${props => props.theme.colors.footerBorder};
  background: ${props => props.theme.colors.footerBackground};
`;

export const FooterItem = styled(Box)`
  font-size: ${rem(fonts.normal)};
  position: relative;
`;
