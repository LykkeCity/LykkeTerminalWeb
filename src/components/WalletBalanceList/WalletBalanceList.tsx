import {rem} from 'polished';
import * as React from 'react';
import {AssetBalanceModel, AssetModel} from '../../models/index';
import styled from '../styled';
import {Table} from '../Table/index';
import {TradingWalletItem} from './';
import {FormattedNumber} from 'react-intl';

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
          <FormattedNumber value={+total.toFixed(accuracy)} />
          {name}
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
