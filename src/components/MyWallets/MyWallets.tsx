import React from 'react';
import {TotalBalance, WalletList} from '.';
import {HeaderCell} from '../Table/styles';
import {WalletBalanceList} from '../WalletBalanceList/';
import {ManageAccount} from './';

import MediaQuery from 'react-responsive';
import {
  MyWalletsContainer,
  Sidebar,
  WalletBalanceListHeader,
  WalletBalances
} from './styles';

const MyWallets = () => (
  <MyWalletsContainer>
    <MediaQuery query="(min-device-width: 1224px)">
      <Sidebar>
        <WalletList />
        <TotalBalance />
        <ManageAccount />
      </Sidebar>
    </MediaQuery>
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
