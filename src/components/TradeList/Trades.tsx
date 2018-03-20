import {observer} from 'mobx-react';
import * as React from 'react';
import {
  InstrumentModel,
  TradeFilter as TradeFilterModel,
  TradeModel
} from '../../models/index';
import * as TradeFilterFns from '../../models/tradeFilter';
import {HBar} from '../Bar';
import {TradeFilter, TradeList} from './index';
import {StyledLoadMore, StyledLoadMoreButton, TradeListToolbar} from './styles';

interface TradesProps {
  trades?: TradeModel[];
  needToLoadMore?: boolean;
  fetchPart: any;
  authorized?: true;
  selectedInstrument: InstrumentModel;
  currentFilter: TradeFilterModel;
  onFilter: (filter: string) => void;
}

const Trades: React.SFC<TradesProps> = ({
  trades = [],
  needToLoadMore,
  fetchPart,
  selectedInstrument,
  currentFilter,
  onFilter
}) => {
  return (
    <React.Fragment>
      <TradeListToolbar>
        <TradeFilter
          value={currentFilter}
          options={TradeFilterFns.toOptions()}
          onFilter={onFilter}
        />
      </TradeListToolbar>
      <HBar />
      <TradeList />
      {needToLoadMore && (
        <StyledLoadMore>
          <StyledLoadMoreButton onClick={fetchPart}>
            Load more...
          </StyledLoadMoreButton>
        </StyledLoadMore>
      )}
    </React.Fragment>
  );
};

export default observer(Trades);
