import * as React from 'react';
import styled from '../styled';
import {Cell, Table} from '../Table/index';
import {BalanceListItem} from './';
import {BalanceListProps} from './';

const cellNumber = 2;
const DataCell = Cell(cellNumber);

const Total = styled.div`
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
    <div className="thead">
      <div className="tr">
        <DataCell className="th">Symbol</DataCell>
        <DataCell className="th">Balance</DataCell>
      </div>
    </div>
    <div className="tbody">
      <Total className="tr">
        <DataCell className="td">Total</DataCell>
        <DataCell className="td">{total.toFixed(accuracy)}</DataCell>
      </Total>
      {balances.map((balanceList: any) => (
        <BalanceListItem
          key={`balanceitem_${balanceList.id}`}
          accuracy={accuracy}
          {...balanceList}
        />
      ))}
    </div>
  </Table>
);

export default BalanceList;
