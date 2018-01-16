import * as React from 'react';
import {Table} from '../Table/index';
import {TradingWalletItem} from './';
import {WalletBalanceListProps} from './';

const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  assets = [],
  accuracy
}) => (
  <Table>
    <thead>
      <tr>
        <th>Assets</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody>
      {assets.map((assetsItem: any, index: number) => (
        <TradingWalletItem
          key={assetsItem.id}
          accuracy={accuracy}
          {...assetsItem}
        />
      ))}
    </tbody>
  </Table>
);

export default WalletBalanceList;
