import * as React from 'react';
import {BalanceListItemProps} from './';
import BalanceNumber from './BalanceNumber';

const BalanceListItem: React.SFC<BalanceListItemProps> = ({
  accuracy,
  totalBalance,
  id,
  profitAndLoss,
  symbol
}) => (
  <tr key={id}>
    <td>{symbol}</td>
    <td>
      <BalanceNumber num={totalBalance.toFixed(accuracy)} />
    </td>
  </tr>
);

export default BalanceListItem;
