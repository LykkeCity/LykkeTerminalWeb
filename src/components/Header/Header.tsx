import {rem} from 'polished';
import * as React from 'react';
import {BalanceInfo} from '../BalanceInfo';
import {Icon} from '../Icon/index';
import {InstrumentPicker} from '../InstrumentPicker';
import {Link} from '../Link/index';
import {SettingsModal} from '../Settings';
import styled from '../styled';
import {Heading} from '../Typography/index';
import {HeaderProps} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

const HeaderItem = styled(Box)`
  position: relative;
  border-right: solid 1px rgba(0, 0, 0, 0.2);
  font-size: ${rem(14)};
  padding: ${rem(20)} ${rem(10)};
`;

const HeaderFlex = styled(Flex)`
  background: #333;
  border-bottom: solid 1px rgba(0, 0, 0, 0.2);
  height: 40px;
`;

const Header: React.SFC<HeaderProps> = ({
  authStore,
  history,
  settingsStore
}) => {
  const signOut = () => {
    authStore.signOut();
  };

  const signIn = () => {
    history.push('signin');
  };

  const settings = () => {
    settingsStore.toggleSettings();
  };

  return (
    <HeaderFlex justify="stretch" align="center" is="header">
      <HeaderItem is="a">
        <Flex align="center">
          <img
            src={`${process.env.PUBLIC_URL}/logo.svg`}
            width="32"
            alt="logo"
          />
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
            <span className="hidden-xs" onClick={settings}>
              <Icon color={`#8c94a0`} name={`cog`} />
            </span>
            {settingsStore.settings ? (
              <div>
                <SettingsModal />
              </div>
            ) : null}
          </HeaderItem>
          <HeaderItem>
            <Link>
              {authStore.isAuth ? (
                <span className="hidden-xs" onClick={signOut}>
                  <Icon color={'#8c94a0'} name={'exit'} />
                </span>
              ) : (
                <span className="hidden-xs" onClick={signIn}>
                  <Icon color={'#8c94a0'} name={'enter'} />
                </span>
              )}
              <i className="icon icon--participate visible-xs" />
            </Link>
          </HeaderItem>
        </Flex>
      </Box>
    </HeaderFlex>
  );
};

export default Header;
