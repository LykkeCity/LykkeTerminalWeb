import {pathOr} from 'rambda';
import * as React from 'react';
import {InstrumentModel, TradeModel} from '../../models/index';
import {Table} from '../Table/index';
import {PublicTradeListItem} from './index';

interface PublicTradeListProps {
  trades: TradeModel[];
  selectedInstrument: InstrumentModel;
}

export const PublicTradeList: React.SFC<PublicTradeListProps> = ({
  trades = [],
  selectedInstrument
}) => (
  <Table>
    <thead>
      <tr>
        <th>Trade size</th>
        <th>
          Price ({pathOr('', ['quoteAsset', 'name'], selectedInstrument)})
        </th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
      {trades.map(trade => (
        <PublicTradeListItem key={trade.id} side={trade.side} {...trade} />
      ))}
    </tbody>
  </Table>
);

export default PublicTradeList;
