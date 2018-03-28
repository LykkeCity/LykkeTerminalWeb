import * as React from 'react';
import {TradeFilter as TradeFilterModel, TradeModel} from '../../models/index';
import {HBar} from '../Bar';
import {Table} from '../Table';
import {HeaderCell} from '../Table/styles';
import {TradeFilter, TradeList} from './index';
import {TradeListToolbar, TradeRow} from './styles';

interface TradesProps {
  trades: TradeModel[];
  fetchNextTrades: any;
  shouldFetchMore?: boolean;
  currentFilter: TradeFilterModel;
  onFilter: (filter: string) => void;
}

const Trades: React.SFC<TradesProps> = ({
  trades = [],
  shouldFetchMore,
  fetchNextTrades
}) => {
  return (
    <React.Fragment>
      <TradeListToolbar>
        <TradeFilter />
      </TradeListToolbar>
      <HBar />
      <Table>
        <thead>
          <TradeRow>
            <HeaderCell w={70}>Asset pair</HeaderCell>
            <HeaderCell w={50}>Side</HeaderCell>
            <th>Volume</th>
            <th>Price</th>
            <th>Opposite volume</th>
            <HeaderCell w={90}>Order type</HeaderCell>
            <th>Fee</th>
            <HeaderCell>Time</HeaderCell>
          </TradeRow>
        </thead>
      </Table>
      <TradeList />
    </React.Fragment>
  );
};

export default Trades;
