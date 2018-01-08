import * as React from 'react';
import styled from '../styled';
import {Table} from '../Table/index';
import {BalanceListItem} from './';
import {BalanceListProps} from './';

const Total = styled.tr`
  background: rgba(0, 0, 0, 0.2);
  td {
    font-weight: bold;
  }
`;

const BalanceList: React.SFC<BalanceListProps> = ({
  balances = [],
  total,
  accuracy
}) => (
  <Table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody>
      <Total>
        <td>Total</td>
        <td>{total.toFixed(accuracy)}</td>
      </Total>
      {balances.map((balanceList: any) => (
        <BalanceListItem
          key={`balanceitem_${balanceList.id}`}
          accuracy={accuracy}
          {...balanceList}
        />
      ))}
    </tbody>
  </Table>
);

export default BalanceList;
