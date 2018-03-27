import * as React from 'react';
import {TradeFilter as TradeFilterModel, TradeModel} from '../../models/index';
import {HBar} from '../Bar';
import {TradeFilter, TradeList} from './index';
import {StyledLoadMore, StyledLoadMoreButton, TradeListToolbar} from './styles';

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
      <TradeList />
      {shouldFetchMore && (
        <StyledLoadMore>
          <StyledLoadMoreButton onClick={fetchNextTrades}>
            Load more...
          </StyledLoadMoreButton>
        </StyledLoadMore>
      )}
    </React.Fragment>
  );
};

export default Trades;
