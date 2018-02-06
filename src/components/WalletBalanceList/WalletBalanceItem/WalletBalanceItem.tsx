import {observer} from 'mobx-react';
import * as React from 'react';
import {WalletBalanceItemProps} from '../';
import WalletBalanceNumber from './WalletBalanceNumber';

const WalletBalanceItem: React.SFC<WalletBalanceItemProps> = ({
  assetBalance
}) => {
  const {id, name, accuracy, available} = assetBalance;
  const formattedBalance = available.toFixed(accuracy).replace(/[.,]?0+$/, '');
  return (
    <tr key={id}>
      <td>{name}</td>
      <td>
        <WalletBalanceNumber num={formattedBalance} />
      </td>
    </tr>
  );
};

export default observer(WalletBalanceItem);
