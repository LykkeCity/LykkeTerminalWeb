import * as React from 'react';
import {WalletBalanceItemProps} from '../';
import WalletBalanceNumber from './WalletBalanceNumber';

const WalletBalanceItem: React.SFC<WalletBalanceItemProps> = ({
  accuracy,
  balance,
  id,
  name
}) => (
  <tr key={id}>
    <td>{name}</td>
    <td>
      <WalletBalanceNumber num={balance.toFixed(accuracy)} />
    </td>
  </tr>
);

export default WalletBalanceItem;
