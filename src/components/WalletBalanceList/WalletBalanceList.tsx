import {rem} from 'polished';
import * as React from 'react';
import {AssetBalanceModel, AssetModel} from '../../models/index';
import styled from '../styled';
import TableScrolled from '../Table/TableScrolled';
import {TradingWalletItem} from './';

const Total = styled.tr`
  background: rgba(0, 0, 0, 0.1);

  td {
    font-weight: bold !important;
    padding-top: ${rem(12)};
    padding-bottom: ${rem(12)};
  }
`;

export interface WalletBalanceListProps {
  assets: AssetBalanceModel[];
  baseAsset: AssetModel;
  total: number;
}

const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  assets = [],
  baseAsset,
  baseAsset: {accuracy, name},
  total
}) => (
  <TableScrolled>
    <thead>
      <tr>
        <th>Assets</th>
        <th>&nbsp;</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody>
      <Total>
        <td>Total</td>
        <td>&nbsp;</td>
        <td>
          {total.toFixed(accuracy)} {name}
        </td>
      </Total>
      {assets.map(assetBalance => (
        <TradingWalletItem
          key={assetBalance.id}
          assetBalance={assetBalance}
          baseAsset={baseAsset}
        />
      ))}
    </tbody>
  </TableScrolled>
);

export default WalletBalanceList;
