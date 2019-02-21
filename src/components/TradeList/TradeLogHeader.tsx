import {pathOr} from 'rambda';
import * as React from 'react';
import {InstrumentModel} from '../../models';
import {HeaderProps, TableHeaderWithoutSort} from '../Table';

export interface TradeLogHeaderProps {
  selectedInstrument: InstrumentModel;
}

const TradeLogHeader: React.SFC<TradeLogHeaderProps> = ({
  selectedInstrument
}) => {
  const headers: HeaderProps[] = [
    {
      key: 'price',
      value: `Price (${pathOr('', ['quoteAsset', 'name'], selectedInstrument)})`
    },
    {
      key: 'volume',
      value: `Trade size (${pathOr(
        '',
        ['baseAsset', 'name'],
        selectedInstrument
      )})`
    },
    {
      className: 'right-align',
      key: 'timestamp',
      value: 'Time'
    }
  ];

  return <TableHeaderWithoutSort headers={headers} />;
};

export default TradeLogHeader;
