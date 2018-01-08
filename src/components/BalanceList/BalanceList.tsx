import * as React from 'react';
import styled from '../styled';
import {Table} from '../Table/index';
import {BalanceListItem} from './';
import {BalanceListProps} from './';

const sum = (a: any, b: any) => Number(a) + Number(b);

const Total = styled.tr`
  background: rgba(0, 0, 0, 0.2);
  td {
    font-weight: bold;
  }
`;

const BalanceList: React.SFC<BalanceListProps> = ({balances = []}) => (
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
        <td>{balances.map(b => b.balance).reduce(sum, [])}</td>
      </Total>
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
