import * as React from 'react';
import {TradingWalletItemProps} from '../';
import TradingWalletNumber from './TradingWalletNumber';

const TradingWalletItem: React.SFC<TradingWalletItemProps> = ({
  accuracy,
  balance,
  id
}) => (
  <tr key={id}>
    <td>{id}</td>
    <td>
      <TradingWalletNumber num={balance.toFixed(accuracy)} />
    </td>
  </tr>
);

export default TradingWalletItem;
