import * as React from 'react';
import {AssetBalanceModel, AssetModel} from '../../models/index';
import WalletModel from '../../models/walletModel';
import TableScrolled from '../Table/TableScrolled';
import {TradingWalletItem} from './';

interface WalletBalanceListProps {
  assets: AssetBalanceModel[];
  baseAsset: AssetModel;
  wallet: WalletModel;
  getAssetById: any;
}

const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  assets = [],
  baseAsset,
  baseAsset: {accuracy, name},
  wallet,
  getAssetById
}) => {
  return (
    <TableScrolled>
      <thead>
        <tr>
          <th>Assets</th>
          <th />
          <th>Base currency</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {wallet &&
          wallet.balances.map((assetBalance, index) => (
            <TradingWalletItem
              key={index}
              baseAsset={baseAsset}
              balance={wallet ? wallet.balances[index] : null}
              asset={getAssetById(wallet.balances[index].AssetId)}
            />
          ))}
      </tbody>
    </TableScrolled>
  );
};

export default WalletBalanceList;
