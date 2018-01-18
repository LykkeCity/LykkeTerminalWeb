import * as React from 'react';
import {Cell, Table} from '../Table/index';
import {TradeListItem} from './';
import {TradeListProps} from './';

const cellNumber = 5;
const DataCell = Cell(cellNumber);

const TradeList: React.SFC<TradeListProps> = ({trades = []}) => (
  <Table>
    <div className="thead">
      <div className="tr">
        <DataCell className="th">Symbol</DataCell>
        <DataCell className="th">Side</DataCell>
        <DataCell className="th">Qnt</DataCell>
        <DataCell className="th">Price</DataCell>
        <DataCell className="th">Timestamp</DataCell>
      </div>
    </div>
    <div className="tbody">
      {trades.map((trade: any) => (
        <TradeListItem key={trade.tradeId} {...trade} />
      ))}
    </div>
  </Table>
);

export default TradeList;
