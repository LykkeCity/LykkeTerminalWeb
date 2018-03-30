import {rem} from 'polished';
import * as React from 'react';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import styled from '../styled';
import {Table} from '../Table/index';
import {BalanceListItem} from './';
import {BalanceListProps} from './';

const Total = styled.tr`
  background: rgba(0, 0, 0, 0.1);

  td {
    font-weight: bold !important;
    padding-top: ${rem(12)};
    padding-bottom: ${rem(12)};
  }
`;

const BalanceList: React.SFC<BalanceListProps> = ({
  balances = [],
  baseAssetName,
  total,
  accuracy
}) => (
  <React.Fragment>
    <Table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th title="Balance in base asset">Balance</th>
        </tr>
      </thead>
      <tbody>
        <Total>
          <td>Total</td>
          <td>
            {formattedNumber(+total, accuracy)}&nbsp;{baseAssetName}
          </td>
        </Total>
        {balances.map((balanceList: any) => (
          <BalanceListItem
            key={`balanceitem_${balanceList.id}`}
            accuracy={accuracy}
            {...balanceList}
            baseAssetName={baseAssetName}
          />
        ))}
      </tbody>
    </Table>
  </React.Fragment>
);

export default BalanceList;
