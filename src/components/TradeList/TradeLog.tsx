import {pathOr} from 'rambda';
import * as React from 'react';
import {InstrumentModel, TradeModel} from '../../models';
import {LoaderProps} from '../Loader/withLoader';
import {HeaderProps, TableHeaderWithoutSort} from '../Table';
import {PublicTradeList} from './';

export interface TradeLogProps extends LoaderProps {
  selectedInstrument: InstrumentModel;
  trades: TradeModel[];
}

const TradeLog: React.SFC<TradeLogProps> = ({selectedInstrument, trades}) => {
  const headers: HeaderProps[] = [
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
      key: 'timestamp',
      value: 'Time'
    }
  ];

  return (
    <React.Fragment>
      <TableHeaderWithoutSort headers={headers} />
      <PublicTradeList trades={trades} />
    </React.Fragment>
  );
};

export default TradeLog;
