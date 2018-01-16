import * as React from 'react';
import {WalletBalanceItemProps} from '../';
import WalletBalanceNumber from './WalletBalanceNumber';

const WalletBalanceItem: React.SFC<WalletBalanceItemProps> = ({
  accuracy,
  balance,
  id
}) => (
  <tr key={id}>
    <td>{id}</td>
    <td>
      <WalletBalanceNumber num={balance.toFixed(accuracy)} />
    </td>
  </tr>
);

export default WalletBalanceItem;
