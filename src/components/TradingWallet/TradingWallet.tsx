import * as React from 'react';
import {Table} from '../Table/index';
import {TradingWalletItem} from './';
import {TradingWalletProps} from './';

const TradingWallet: React.SFC<TradingWalletProps> = ({
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
          key={`assetsitem_${index}`}
          accuracy={accuracy}
          {...assetsItem}
        />
      ))}
    </tbody>
  </Table>
);

export default TradingWallet;
