import {curry, pathOr} from 'rambda';
import * as React from 'react';
import {TradeListItem} from '.';
import {InstrumentModel, TradeModel} from '../../models';
import {Table} from '../Table';

const assetFromInstrument = (instrument: InstrumentModel, assetType: string) =>
  pathOr('', [assetType, 'name'], instrument);

export interface TradeListProps {
  trades: TradeModel[];
  selectedInstrument: InstrumentModel | null;
}

const TradeList: React.SFC<TradeListProps> = ({
  trades = [],
  selectedInstrument
}) => {
  const assetFromSelectedInstrument = curry(assetFromInstrument)(
    selectedInstrument!
  );
  return (
    <Table>
      <thead>
        <tr>
          <th>Asset pair</th>
          <th>Side</th>
          <th>Volume ({assetFromSelectedInstrument('baseAsset')})</th>
          <th>Price</th>
          <th>Volume ({assetFromSelectedInstrument('quoteAsset')})</th>
          <th>Order type</th>
          <th>Fee</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {trades.map(trade => <TradeListItem key={trade.id} {...trade} />)}
      </tbody>
    </Table>
  );
};

export default TradeList;
