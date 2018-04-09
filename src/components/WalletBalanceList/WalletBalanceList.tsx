import {rem} from 'polished';
import * as React from 'react';
import {AssetBalanceModel, AssetModel} from '../../models/index';
import styled from '../styled';
import {Table} from '../Table/index';
import {Cell, HeaderCell} from '../Table/styles';
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
  <Table>
    <thead>
      <tr>
        <HeaderCell w={60}>Assets</HeaderCell>
        <th>&nbsp;</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody>
      <Total>
        <Cell w={60}>Total</Cell>
        <td>&nbsp;</td>
        <td>
          {total.toLocaleString(undefined, {
            maximumFractionDigits: accuracy
          })}&nbsp;{name}
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
  </Table>
);

export default WalletBalanceList;
