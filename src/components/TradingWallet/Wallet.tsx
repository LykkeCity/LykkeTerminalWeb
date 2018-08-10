import React from 'react';
import {HeaderCell} from '../Table';
import {WalletBalanceList} from '../WalletBalanceList';
import {
  StyledWalletItem,
  WalletBalanceListHeader,
  WalletBalances,
  WalletContainer
} from './styles';

const Wallet: React.SFC = () => (
  <WalletContainer>
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
