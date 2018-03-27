import * as React from 'react';
import {AssetBalanceModel, AssetModel} from '../../models/index';
import TableScrolled from '../Table/TableScrolled';
import {TradingWalletItem} from './';

export interface WalletBalanceListProps {
  assets: AssetBalanceModel[];
  baseAsset: AssetModel;
  total: number;
}

const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  assets = [],
  baseAsset,
  baseAsset: {accuracy, name},
  total
}) => (
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
      {assets.map(assetBalance => (
        <TradingWalletItem
          key={assetBalance.id}
          assetBalance={assetBalance}
          baseAsset={baseAsset}
        />
      ))}
    </tbody>
  </TableScrolled>
);

export default WalletBalanceList;
