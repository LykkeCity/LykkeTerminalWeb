import React from 'react';
import {TotalBalance, WalletList} from '.';
import {HeaderCell} from '../Table/styles';
import {WalletBalanceList} from '../WalletBalanceList/';
import {
  ManageAccountLink,
  MyWalletsContainer,
  Sidebar,
  WalletBalanceListHeader,
  WalletBalances
} from './styles';

const MyWallets = () => (
  <MyWalletsContainer>
    <Sidebar>
      <WalletList />
      <TotalBalance />
      <ManageAccountLink
        href={process.env.REACT_APP_WEBWALLET_URL}
        target="_blank"
      >
        Manage Wallets
      </ManageAccountLink>
    </Sidebar>
    <WalletBalances>
      <WalletBalanceListHeader>
        <thead>
          <tr>
            <HeaderCell w="20%">Asset</HeaderCell>
            <HeaderCell w="40%">Base currency</HeaderCell>
            <HeaderCell w="40%">Balance</HeaderCell>
          </tr>
        </thead>
      </WalletBalanceListHeader>
      <WalletBalanceList />
    </WalletBalances>
  </MyWalletsContainer>
);

export default MyWallets;
