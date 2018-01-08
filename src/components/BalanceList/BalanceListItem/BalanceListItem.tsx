import * as React from 'react';
import {BalanceListItemProps} from '../';
import BalanceNumber from './BalanceNumber';

const BalanceListItem: React.SFC<BalanceListItemProps> = ({
  accuracy,
  balance,
  id,
  profitAndLoss,
  symbol
}) => (
  <tr key={id}>
    <td>{symbol}</td>
    <td>
      <BalanceNumber num={balance.toFixed(accuracy)} />
    </td>
  </tr>
);

export default BalanceListItem;
