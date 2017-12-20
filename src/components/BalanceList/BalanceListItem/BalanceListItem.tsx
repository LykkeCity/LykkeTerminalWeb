import * as React from 'react';
import {BalanceListItemInterface} from '../';
import BalanceNumber from './BalanceNumber';

const BalanceListItem: React.SFC<BalanceListItemInterface> = ({
  balance,
  id,
  profitAndLoss,
  symbol
}) => (
  <tr key={id}>
    <td>{symbol}</td>
    <td>
      <BalanceNumber num={balance.toFixed(2)} />
    </td>
    <td>
      <BalanceNumber num={profitAndLoss.toFixed(2)} />
    </td>
  </tr>
);

export default BalanceListItem;
