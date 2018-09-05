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
  border-bottom: solid 1px ${props => props.theme.colors.footerBorder};
  background: ${props => props.theme.colors.footerBackground};
`;

export const FooterItem = styled(Box)`
  font-size: ${rem(fonts.normal)};
  position: relative;
`;
