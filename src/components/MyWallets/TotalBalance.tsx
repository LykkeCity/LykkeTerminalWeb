import React from 'react';
import {AssetModel} from '../../models';
import {Total, TotalAmount, TotalLabel} from './styles';

export interface TotalBalanceProps {
  total: number;
  baseAsset: AssetModel;
  formatBalance: (asset: AssetModel, balance: number) => string;
}

const TotalBalance: React.SFC<TotalBalanceProps> = ({
  total,
  baseAsset,
  formatBalance
}) => (
  <Total>
    <TotalAmount title={formatBalance(baseAsset, total)}>
      {formatBalance(baseAsset, total)}
    </TotalAmount>
    <TotalLabel>Total Balance</TotalLabel>
  </Total>
);

export default TotalBalance;
