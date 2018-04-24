import React from 'react';
import {TotalBalance, WalletList} from '.';
import ModalMessages from '../../constants/modalMessages';
import Types from '../../models/modals';
import {HeaderCell} from '../Table/styles';
import {WalletBalanceList} from '../WalletBalanceList/';
import {
  ManageAccountLink,
  MyWalletsContainer,
  Sidebar,
  WalletBalanceListHeader,
  WalletBalances
} from './styles';

interface MyWalletsProps {
  addModal: any;
}

const MyWallets: React.SFC<MyWalletsProps> = ({addModal}) => {
  const handleManageWallets = () =>
    addModal(
      ModalMessages.attention('manageWallets'),
      null,
      null,
      Types.Attention
    );

  return (
    <MyWalletsContainer>
      <Sidebar>
        <WalletList />
        <TotalBalance />
        <ManageAccountLink onClick={handleManageWallets}>
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
};

export default MyWallets;
