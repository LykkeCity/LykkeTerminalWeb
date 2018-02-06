import * as React from 'react';
import {AssetBalanceModel} from '../../models/index';
import styled from '../styled';
import {Table} from '../Table/index';
import {TradingWalletItem} from './';

const Total = styled.tr`
  background: rgba(0, 0, 0, 0.2);
  td {
    font-weight: bold;
  }
`;

export interface WalletBalanceListProps {
  assets: AssetBalanceModel[];
  accuracy: number;
  total: number;
}

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
      {assets.map(asset => (
        <TradingWalletItem key={asset.id} assetBalance={asset} />
      ))}
    </tbody>
  </Table>
);

export default WalletBalanceList;
