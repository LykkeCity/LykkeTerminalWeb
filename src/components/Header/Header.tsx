import * as React from 'react';
import AuthStore from '../../stores/authStore';
import SettingsStore from '../../stores/settingsStore';
import {Icon} from '../Icon/index';
import {InstrumentPerformance} from '../InstrumentPerformance';
import {InstrumentPicker} from '../InstrumentPicker';
import {SettingsModal} from '../Settings';
import {ThemeObject} from '../styled';
import {BalanceInfo} from '../UserInfo/BalanceInfo';
import {HeaderFlex, HeaderItem, HeaderWrapper} from './styles';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

export interface HeaderProps {
  authStore: AuthStore;
  settingsStore: SettingsStore;
  readOnlyMode: boolean;
  theme: ThemeObject;
}

const Header: React.SFC<HeaderProps> = ({
  authStore,
  settingsStore,
  readOnlyMode,
  theme
}) => {
  const handleToggleSettings = (event?: any) => {
    if (event) {
      event.stopPropagation();
    }

    settingsStore.toggleSettings();
  };

  return (
    <HeaderWrapper>
      <HeaderFlex justify="stretch" align="center">
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
                  <Icon name={'cogwheel'} color={theme.colors.headerIcon} />
                </span>
                {settingsStore.showSettings ? (
                  <SettingsModal handleCloseSettings={handleToggleSettings} />
                ) : null}
              </HeaderItem>
            ) : null}
          </Flex>
        </Box>
      </HeaderFlex>
    </HeaderWrapper>
  );
};

export default Header;
