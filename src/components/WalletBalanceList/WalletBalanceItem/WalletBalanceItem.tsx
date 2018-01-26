import * as React from 'react';
import {WalletBalanceItemProps} from '../';
import WalletBalanceNumber from './WalletBalanceNumber';

const WalletBalanceItem: React.SFC<WalletBalanceItemProps> = ({
  accuracy,
  balance,
  id,
  name
}) => {
  const calcBalance = balance.toFixed(accuracy).replace(/\.?0+$/, '');
  return (
    <tr key={id}>
      <td>{name}</td>
      <td>
        <WalletBalanceNumber num={calcBalance} />
      </td>
    </tr>
  );
};

export default WalletBalanceItem;
