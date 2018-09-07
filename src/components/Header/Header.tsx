import * as React from 'react';
import {AnalyticsEvents} from '../../constants/analyticsEvents';
import {AnalyticsService} from '../../services/analyticsService';
import AuthStore from '../../stores/authStore';
import SettingsStore from '../../stores/settingsStore';
import {Icon} from '../Icon/index';
import {InstrumentPerformance} from '../InstrumentPerformance';
import {InstrumentPicker} from '../InstrumentPicker';
import {SettingsModal} from '../Settings';
import {colors} from '../styled';
import {BalanceInfo} from '../UserInfo/BalanceInfo';
import {HeaderFlex, HeaderItem, HeaderWrapper} from './styles';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

export interface HeaderProps {
  authStore: AuthStore;
  settingsStore: SettingsStore;
  readOnlyMode: boolean;
}

const Header: React.SFC<HeaderProps> = ({
  authStore,
  settingsStore,
  readOnlyMode
}) => {
  const handleToggleSettings = (event?: any) => {
    if (event) {
      event.stopPropagation();
    }
    settingsStore.toggleSettings();
    if (settingsStore.showSettings) {
      AnalyticsService.track(AnalyticsEvents.OpenSettingsModal);
    }
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
                  <Icon name={'cogwheel'} color={colors.coolGrey} />
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
