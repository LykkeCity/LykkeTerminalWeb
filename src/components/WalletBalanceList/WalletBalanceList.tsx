import * as React from 'react';
import {AssetBalanceModel, AssetModel} from '../../models/index';
import WalletModel from '../../models/walletModel';
import {Table} from '../Table';
import {WalletBalanceItem} from './index';

export interface WalletBalanceListProps {
  assets: AssetBalanceModel[];
  baseAsset: AssetModel;
  wallet: WalletModel;
  getAssetById: any;
}

const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  wallet,
  assets = [],
  baseAsset,
  baseAsset: {accuracy, name},
  getAssetById
}) => {
  const balances = wallet
    ? wallet.balances.filter(assetBalance => !!assetBalance.balance)
    : null;

  return (
    <Table>
      <tbody>
        {balances &&
          balances.map(assetBalance => (
            <WalletBalanceItem
              key={assetBalance.id}
              assetBalance={assetBalance}
              baseAsset={baseAsset}
            />
          ))}
      </tbody>
    </Table>
  );
};

export default WalletBalanceList;
