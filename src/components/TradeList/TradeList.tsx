import * as React from 'react';
import {TradeListItem} from '.';
import {TradeModel} from '../../models';
import {LoaderProps} from '../Loader/withLoader';
import {Table} from '../Table';
import {StyledLoadMore, StyledLoadMoreButton} from './styles';

export interface TradeListProps extends LoaderProps {
  trades: TradeModel[];
  fetchNextTrades?: any;
  shouldFetchMore?: boolean;
  isAllTrades: boolean;
  onChangeInstrumentById: (id: string) => void;
  selectedInstrumentId: string;
}

const TradeList: React.SFC<TradeListProps> = ({
  trades = [],
  fetchNextTrades,
  shouldFetchMore,
  isAllTrades,
  onChangeInstrumentById,
  selectedInstrumentId
}) => (
  <React.Fragment>
    <Table>
      <tbody>
        {trades.map(trade => (
          <TradeListItem
            key={trade.id}
            {...trade}
            clickable={isAllTrades}
            changeInstrumentById={onChangeInstrumentById}
            isSelected={selectedInstrumentId === trade.instrument!.id}
          />
        ))}
      </tbody>
    </Table>
    {shouldFetchMore && (
      <StyledLoadMore>
        <StyledLoadMoreButton onClick={fetchNextTrades}>
          Load more...
        </StyledLoadMoreButton>
      </StyledLoadMore>
    )}
  </React.Fragment>
);

export default TradeList;
