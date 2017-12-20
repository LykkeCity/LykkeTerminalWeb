import * as React from 'react';
import {Table} from '../Table/index';
import {BalanceListItem} from './';
import {BalanceListInterface} from './';

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
          key={`balanceitem_${balanceList.id}`}
          {...balanceList}
        />
      ))}
    </tbody>
  </Table>
);

export default BalanceList;
