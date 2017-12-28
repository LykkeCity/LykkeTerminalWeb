import {rem} from 'polished';
import * as React from 'react';
import {BalanceInfo} from '../BalanceInfo';
import {InstrumentPicker} from '../InstrumentPicker/index';
import {Link} from '../Link/index';
import styled from '../styled';
import {Heading} from '../Typography/index';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

const HeaderItem = styled(Box)`
  border-right: solid 1px rgba(0, 0, 0, 0.2);
  font-size: ${rem(14)};
  padding: ${rem(20)} ${rem(10)};
`;

const HeaderFlex = styled(Flex)`
  background: #333;
  border-bottom: solid 1px rgba(0, 0, 0, 0.2);
  height: 40px;
`;

const Header = () => (
  <HeaderFlex justify="stretch" align="center" is="header">
    <HeaderItem is="a">
      <Flex align="center">
        <img src={`${process.env.PUBLIC_URL}/logo.svg`} width="32" alt="logo" />
        <Heading>Lykke</Heading>
      </Flex>
    </HeaderItem>
    <HeaderItem>
      <InstrumentPicker value="BTCUSD" instruments={[]} />
    </HeaderItem>

    <Box ml="auto" is="menu">
      <Flex align="center">
        <HeaderItem>
          <BalanceInfo />
        </HeaderItem>
        <HeaderItem>
          <Link href="/signin">
            <span className="hidden-xs">Sign In</span>
            <i className="icon icon--participate visible-xs" />
          </Link>
        </HeaderItem>
      </Flex>
    </Box>
  </HeaderFlex>
);

export default Header;
