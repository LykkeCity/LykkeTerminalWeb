import {observer} from 'mobx-react';
import * as React from 'react';
import {WalletBalanceItemProps} from '../';
import WalletBalanceNumber from './WalletBalanceNumber';

const WalletBalanceItem: React.SFC<WalletBalanceItemProps> = ({
  accuracy,
  assetBalance
}) => {
  const {id, name, balance, reserved} = assetBalance;
  const calculatedBalance: string = (balance - (reserved || 0))
    .toFixed(accuracy)
    .replace(/[.,]?0+$/, '');
  return (
    <tr key={id}>
      <td>{name}</td>
      <td>
        <WalletBalanceNumber num={calculatedBalance} />
      </td>
    </tr>
  );
};

export default observer(WalletBalanceItem);
