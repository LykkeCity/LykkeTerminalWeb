import * as React from 'react';
import {AssetModel} from '../../models/index';
import WalletModel from '../../models/walletModel';
import {Table} from '../Table';
import {HeaderCell} from '../Table/styles';
import {WalletBalanceItem} from './index';

interface WalletBalanceListProps {
  baseAsset: AssetModel;
  wallet: WalletModel;
  getAssetById: any;
}

const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  baseAsset,
  baseAsset: {accuracy, name},
  wallet: {balances},
  getAssetById
}) => {
  return (
    <Table>
      <thead>
        <tr>
          <HeaderCell w={'20%'}>Assets</HeaderCell>
          <HeaderCell w={'40%'}>Base currency</HeaderCell>
          <HeaderCell w={'40%'}>Balance</HeaderCell>
        </tr>
      </thead>
      <tbody>
        {balances.map((assetBalance, index) => (
          <WalletBalanceItem
            key={index}
            baseAsset={baseAsset}
            balance={balances[index]}
            asset={getAssetById(balances[index].id)}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default WalletBalanceList;
