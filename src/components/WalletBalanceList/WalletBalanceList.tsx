import * as React from 'react';
import styled from '../styled';
import {Table} from '../Table/index';
import {TradingWalletItem} from './';
import {WalletBalanceListProps} from './';

const Total = styled.tr`
  background: rgba(0, 0, 0, 0.2);
  td {
    font-weight: bold;
  }
`;

const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  assets = [],
  accuracy,
  total
}) => (
  <Table>
    <thead>
      <tr>
        <th>Assets</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody>
      <Total>
        <td>Total</td>
        <td>{total.toFixed(accuracy)}</td>
      </Total>
      {assets.map((assetsItem: any, index: number) => (
        <TradingWalletItem key={assetsItem.id} {...assetsItem} />
      ))}
    </tbody>
  </Table>
);

export default WalletBalanceList;
