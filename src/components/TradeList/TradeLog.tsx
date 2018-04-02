import {pathOr} from 'rambda';
import * as React from 'react';
import {InstrumentModel} from '../../models';
import {LoaderProps} from '../Loader/withLoader';
import {Table} from '../Table';
import {HeaderCell} from '../Table/styles';
import {PublicTradeList} from './';

export interface TradeLogProps extends LoaderProps {
  selectedInstrument: InstrumentModel;
}

const TradeLog: React.SFC<TradeLogProps> = ({selectedInstrument}) => (
  <React.Fragment>
    <Table>
      <thead>
        <tr>
          <th>Trade size</th>
          <th>
            Price ({pathOr('', ['quoteAsset', 'name'], selectedInstrument)})
          </th>
          <HeaderCell w={50}>Side</HeaderCell>
          <th>Time</th>
        </tr>
      </thead>
    </Table>
    <PublicTradeList />
  </React.Fragment>
);

export default TradeLog;
