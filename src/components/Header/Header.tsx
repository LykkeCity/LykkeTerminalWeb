import {rem} from 'polished';
import * as React from 'react';
import ClickOutside from '../ClickOutside/ClickOutside';
import {Icon} from '../Icon/index';
import {InstrumentPerformance} from '../InstrumentPerformance';
import {InstrumentPicker} from '../InstrumentPicker';
import {Link} from '../Link/index';
import {SettingsModal} from '../Settings';
import styled from '../styled';
import {BalanceInfo} from '../UserInfo/BalanceInfo';
import {CurrentWallet} from '../UserInfo/CurrentWallet';
import {HeaderProps} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

export const HeaderItem = styled(Box)`
  border-left: solid 1px rgba(0, 0, 0, 0.2);
  font-size: ${rem(14)};
  /* height: 26px; */

  &:first-child {
    border-left: 0;
  }

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

const HeaderWrapper = styled.header`
  padding: ${rem(9)} ${rem(11)};
  height: 50px;
  border-bottom: solid 1px #292929;
  background: #333;
`;

const Logo = styled.div`
  margin-right: ${rem(18)};
`;

const HeaderFlex = styled(Flex)`
  height: 100%;
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
            {authStore.isAuth ? (
              <HeaderItem>
                <Flex>
                  <CurrentWallet />
                  <BalanceInfo />
                </Flex>
              </HeaderItem>
            ) : null}
            {authStore.isAuth ? (
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
