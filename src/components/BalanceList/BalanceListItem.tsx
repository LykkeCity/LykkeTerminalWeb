import * as React from 'react';
import {BalanceListItemProps} from './';
import BalanceNumber from './BalanceNumber';

const BalanceListItem: React.SFC<BalanceListItemProps> = ({
  accuracy,
  totalBalance,
  id,
  profitAndLoss,
  symbol,
  baseAssetName
}) => (
  <tr key={id}>
    <td>{symbol}</td>
    <td>
      <BalanceNumber
        num={totalBalance.toLocaleString(undefined, {
          maximumFractionDigits: accuracy
        })}
      >
        &nbsp;{baseAssetName}
      </BalanceNumber>
    </td>
  </tr>
);

export default BalanceListItem;
