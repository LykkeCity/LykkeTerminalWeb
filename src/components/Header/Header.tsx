import * as React from 'react';
import AuthStore from '../../stores/authStore';
import SettingsStore from '../../stores/settingsStore';
import {Icon} from '../Icon/index';
import {InstrumentPerformance} from '../InstrumentPerformance';
import {InstrumentPicker} from '../InstrumentPicker';
import {SettingsModal} from '../Settings';
import {colors} from '../styled';
import {UserName} from '../UserInfo';
import {BalanceInfo} from '../UserInfo/BalanceInfo';
import {HeaderFlex, HeaderItem, HeaderWrapper, Logo} from './styles';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

export interface HeaderProps {
  authStore: AuthStore;
  history: any;
  settingsStore: SettingsStore;
  readOnlyMode: boolean;
}

const Header: React.SFC<HeaderProps> = ({
  authStore,
  history,
  settingsStore,
  readOnlyMode
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
            {authStore.isAuth && !readOnlyMode ? (
              <HeaderItem>
                <Flex>
                  <BalanceInfo />
                </Flex>
              </HeaderItem>
            ) : null}
            {authStore.isAuth && !readOnlyMode ? (
              <HeaderItem>
                <span
                  className="hidden-xs settings"
                  onClick={handleToggleSettings}
                >
                  <Icon name={'cogwheel'} color={colors.coolGrey} />
                </span>
                {settingsStore.showSettings ? (
                  <SettingsModal handleCloseSettings={handleCloseSettings} />
                ) : null}
              </HeaderItem>
            ) : null}
            {authStore.isAuth ? (
              <HeaderItem>
                <Flex>
                  <UserName />
                </Flex>
              </HeaderItem>
            ) : null}
            <HeaderItem>
              {authStore.isAuth ? (
                <span className="hidden-xs" onClick={signOut}>
                  <Icon name={'logout'} color={colors.coolGrey} />
                </span>
              ) : (
                <span className="hidden-xs" onClick={signIn}>
                  <Icon name={'login'} color={colors.coolGrey} />
                </span>
              )}
              <i className="icon icon--participate visible-xs" />
            </HeaderItem>
          </Flex>
        </Box>
      </HeaderFlex>
    </HeaderWrapper>
  );
};

export default Header;
