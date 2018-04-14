import * as React from 'react';
import AuthStore from '../../stores/authStore';
import SettingsStore from '../../stores/settingsStore';
import ClickOutside from '../ClickOutside/ClickOutside';
import {Icon} from '../Icon/index';
import {InstrumentPerformance} from '../InstrumentPerformance';
import {InstrumentPicker} from '../InstrumentPicker';
import {Link} from '../Link/index';
import {SettingsModal} from '../Settings';
import {HeaderFlex, HeaderItem, HeaderWrapper, Logo} from './styles';
import styled from '../styled';
import {BalanceInfo} from '../UserInfo/BalanceInfo';
import {HeaderProps} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

export interface HeaderProps {
  authStore: AuthStore;
  history: any;
  settingsStore: SettingsStore;
  viewMode: boolean;
}

const Header: React.SFC<HeaderProps> = ({
  authStore,
  history,
  settingsStore,
  viewMode
}) => {
  const signOut = () => {
    authStore.signOut();
  };

  const signIn = () => {
    authStore.signIn();
  };

  const handleToggleSettings = (e: any) => {
    document.querySelector('.settings')!.classList.toggle('active');
    e.stopPropagation();
    settingsStore.toggleSettings();
  };

  const handleCloseSettings = () => {
    document.querySelector('.settings')!.classList.remove('active');
    settingsStore.showSettings = false;
  };

  return (
    <HeaderWrapper>
      <HeaderFlex justify="stretch" align="center">
        <HeaderItem is="a">
          <Flex align="center">
            <Logo>
              <img
                src={`${process.env.PUBLIC_URL}/logo_lykke.svg`}
                width="100"
                alt="logo"
              />
            </Logo>
          </Flex>
        </HeaderItem>
        <HeaderItem>
          <InstrumentPicker value="BTCUSD" instruments={[]} />
        </HeaderItem>
        <InstrumentPerformance />

        <Box ml="auto" is="menu">
          <Flex align="center">
            {authStore.isAuth && !viewMode ? (
              <HeaderItem>
                <Flex>
                  <BalanceInfo />
                </Flex>
              </HeaderItem>
            ) : null}
            {authStore.isAuth && !viewMode ? (
              <ClickOutside onClickOutside={handleCloseSettings}>
                <HeaderItem>
                  <span
                    className="hidden-xs settings"
                    onClick={handleToggleSettings}
                  >
                    <Icon color={`#8c94a0`} name={`cog`} />
                  </span>
                  {settingsStore.showSettings ? <SettingsModal /> : null}
                </HeaderItem>
              </ClickOutside>
            ) : null}
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
    </HeaderWrapper>
  );
};

export default Header;
