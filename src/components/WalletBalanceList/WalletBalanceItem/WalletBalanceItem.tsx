import * as React from 'react';
import {WalletBalanceItemProps} from '../';
import WalletBalanceNumber from './WalletBalanceNumber';

const WalletBalanceItem: React.SFC<WalletBalanceItemProps> = ({
  accuracy,
  balance,
  id,
  name,
  reserved
}) => {
  const calculatedBalance: number = balance - (reserved || 0);
  return (
    <tr key={id}>
      <td>{name}</td>
      <td>
        <WalletBalanceNumber num={calculatedBalance.toFixed(accuracy)} />
      </td>
    </tr>
  );
};

export default WalletBalanceItem;
