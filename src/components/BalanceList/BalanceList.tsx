import * as React from 'react';
import {Table} from '../Table/index';
import {BalanceListItem} from './';
import BalanceListInterface from './BalanceListInterface';

const BalanceList: React.SFC<BalanceListInterface> = ({balances = []}) => (
  <Table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Balance</th>
        <th>PnL</th>
      </tr>
    </thead>
    <tbody>
      {balances.map((balanceList: any) => (
        <BalanceListItem
          balance={balanceList.balance}
          id={balanceList.id}
          key={`balanceitem_${balanceList.id}`}
          profitAndLoss={balanceList.profitAndLoss}
          symbol={balanceList.symbol}
        />
      ))}
    </tbody>
  </Table>
);

export default BalanceList;
