import * as React from 'react';
import {TradeModel} from '../../models/index';
import {Cell, Table} from '../Table/index';
import {TradeListItem} from './';

interface TradeListProps {
  trades?: TradeModel[];
}

const cellNumber = 4;
const DataCell = Cell(cellNumber);

const TradeList: React.SFC<TradeListProps> = ({trades = []}) => (
  <Table>
    <div className="thead">
      <div className="tr">
        <DataCell className="th">Symbol</DataCell>
        <DataCell className="th">Qnt</DataCell>
        <DataCell className="th">Price</DataCell>
        <DataCell className="th">Timestamp</DataCell>
      </div>
    </div>
    <div className="tbody">
      {trades.map(trade => <TradeListItem key={trade.tradeId} {...trade} />)}
    </div>
  </Table>
);

export default TradeList;
