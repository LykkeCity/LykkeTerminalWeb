import * as React from 'react';
import styled from '../styled';
import {Cell, Table} from '../Table/index';
import {TradingWalletItem} from './';
import {WalletBalanceListProps} from './';

const Total = styled.div`
  background: rgba(0, 0, 0, 0.2);
  .td {
    font-weight: bold;
  }
`;

const cellNumber = 2;
const DataCell = Cell(cellNumber);

const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  assets = [],
  accuracy,
  total
}) => (
  <Table>
    <div className="thead">
      <div className="tr">
        <DataCell className="th">Assets</DataCell>
        <DataCell className="th">Balance</DataCell>
      </div>
    </div>
    <div className="tbody">
      <Total className="tr">
        <DataCell className="td">Total</DataCell>
        <DataCell className="td">{total.toFixed(accuracy)}</DataCell>
      </Total>
      {assets.map((assetsItem: any, index: number) => (
        <TradingWalletItem
          key={assetsItem.id}
          accuracy={accuracy}
          {...assetsItem}
        />
      ))}
    </div>
  </Table>
);

export default WalletBalanceList;
