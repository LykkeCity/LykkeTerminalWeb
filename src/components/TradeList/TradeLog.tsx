import {pathOr} from 'rambda';
import * as React from 'react';
import {InstrumentModel, TradeModel} from '../../models';
import {LoaderProps} from '../Loader/withLoader';
import {TableHeaderNoSort} from '../Table';
import {PublicTradeList, PublicTradesCellWidth} from './';

export interface TradeLogProps extends LoaderProps {
  selectedInstrument: InstrumentModel;
  trades: TradeModel[];
}

const TradeLog: React.SFC<TradeLogProps> = ({selectedInstrument, trades}) => {
  const headers: any[] = [
    {
      key: 'price',
      value: `Price (${pathOr('', ['quoteAsset', 'name'], selectedInstrument)})`
    },
    {
      className: 'right-align',
      key: 'volume',
      value: 'Trade size'
    },
    {
      className: 'right-align',
      key: 'side',
      value: 'Side',
      width: PublicTradesCellWidth.Side
    },
    {
      className: 'right-align',
      key: 'timestamp',
      value: 'Time'
    }
  ];

  return (
    <React.Fragment>
      <TableHeaderNoSort headers={headers} />
      <PublicTradeList trades={trades} />
    </React.Fragment>
  );
};

export default TradeLog;
