import {rem} from 'polished';
import * as React from 'react';
import styled, {dims, fonts} from '../styled';
import {Table} from '../Table/index';
import {BalanceListItem} from './';
import {BalanceListProps} from './';

const ManageWalletLink = styled.a`
  cursor: pointer;
  text-decoration: none;
  color: rgb(245, 246, 247);
  width: 100%;
  min-height: 32px;
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${rem(fonts.normal)};
  line-height: 1.14;
  margin: ${rem(dims.padding[1])} 0;
`;

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
            {total.toLocaleString(undefined, {
              maximumFractionDigits: accuracy
            })}&nbsp;{baseAssetName}
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
    <ManageWalletLink
      href={process.env.REACT_APP_WEBWALLET_URL}
      target="_blank"
    >
      Manage wallets
    </ManageWalletLink>
  </React.Fragment>
);

export default BalanceList;
