import React from 'react';
import {AnalyticsEvents} from '../../constants/analyticsEvents';
import AnalyticsService from '../../services/analyticsService';
import {HeaderCell} from '../Table';
import {WalletBalanceList} from '../WalletBalanceList';
import {
  StyledWalletItem,
  WalletBalanceListHeader,
  WalletBalances,
  WalletContainer
} from './styles';

const handleClick = () => {
  AnalyticsService.track(AnalyticsEvents.FundsClicked);
};

const Wallet: React.SFC = () => (
  <WalletContainer onClick={handleClick}>
    <StyledWalletItem>
      <WalletBalances>
        <WalletBalanceListHeader>
          <thead>
            <tr>
              <HeaderCell w="30%">Asset</HeaderCell>
              <HeaderCell w="70%">Available</HeaderCell>
            </tr>
          </thead>
        </WalletBalanceListHeader>
        <WalletBalanceList />
      </WalletBalances>
    </StyledWalletItem>
  </WalletContainer>
);

export default Wallet;
