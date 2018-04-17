import React from 'react';
import {TotalBalance, WalletActions, WalletList} from '.';
import {AssetModel, WalletModel} from '../../models';
import {WalletBalanceList} from '../WalletBalanceList/';
import {
  ManageAccountLink,
  MyWalletsContainer,
  Sidebar,
  WalletBalances
} from './styles';

export interface MyWalletsProps extends WalletActions {
  currentWallet: WalletModel;
  total: number;
  baseAsset: AssetModel;
}

const MyWallets: React.SFC<MyWalletsProps> = ({
  currentWallet,
  baseAsset,
  total
}) => (
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
      <WalletBalanceList wallet={currentWallet} />
    </WalletBalances>
  </MyWalletsContainer>
);

export default MyWallets;
