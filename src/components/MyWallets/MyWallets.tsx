import React from 'react';
import {TotalBalance, WalletList} from '.';
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
            <th>Asset</th>
            <th>Base currency</th>
            <th>Balance</th>
          </tr>
        </thead>
      </WalletBalanceListHeader>
      <WalletBalanceList />
    </WalletBalances>
  </MyWalletsContainer>
);

export default MyWallets;
