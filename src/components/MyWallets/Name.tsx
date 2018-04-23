import React from 'react';
import {WalletActions} from '.';
import {AssetModel, WalletModel} from '../../models';
import {StyledWalletItem, WalletName, WalletTotalBalance} from './styles';

export interface WalletItemProps extends WalletModel, WalletActions {
  selectedId: string;
  baseAsset: AssetModel;
  formatBalance: (asset: AssetModel, balance: number) => string;
}

const WalletItem: React.SFC<WalletItemProps> = ({
  id,
  name,
  totalBalance,
  selectedId,
  onChangeWallet,
  formatBalance,
  baseAsset
}) => (
  <StyledWalletItem
    selected={selectedId === id}
    // tslint:disable-next-line:jsx-no-lambda
    onClick={() => onChangeWallet(id)}
  >
    <WalletName title={name}>{name}</WalletName>
    <WalletTotalBalance title={formatBalance(baseAsset, totalBalance)}>
      {formatBalance(baseAsset, totalBalance)}
    </WalletTotalBalance>
  </StyledWalletItem>
);

export default WalletItem;
