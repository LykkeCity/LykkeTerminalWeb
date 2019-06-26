import * as React from 'react';
import {TradeListItem} from '.';
import {TradeModel} from '../../models';
import {LoaderProps} from '../Loader/withLoader';
import {Table} from '../Table';
import {StyledEmptyState, StyledLoadMore, StyledLoadMoreButton} from './styles';

export interface TradeListProps extends LoaderProps {
  trades: TradeModel[];
  fetchNextTrades?: any;
  shouldFetchMore?: boolean;
  onChangeInstrumentById: (id: string) => void;
  selectedInstrumentId: string;
}

const TradeList: React.SFC<TradeListProps> = ({
  trades = [],
  fetchNextTrades,
  shouldFetchMore,
  onChangeInstrumentById,
  selectedInstrumentId
}) => (
  <React.Fragment>
    <Table>
      <tbody>
        {trades.length === 0 && (
          <tr>
            <StyledEmptyState>
              <div
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 'bold',
                  fontFamily: `'Akrobat'`,
                  paddingBottom: '5px'
                }}
              >
                No results
              </div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 'normal'
                }}
              >
                Try modifying filters
              </div>
            </StyledEmptyState>
          </tr>
        )}
        {trades.map(trade => (
          <TradeListItem
            key={trade.id}
            {...trade}
            changeInstrumentById={onChangeInstrumentById}
            isSelected={selectedInstrumentId === trade.symbol}
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
