import {HBar} from '@lykkex/react-components';
import * as React from 'react';
import {AnalyticsEvents} from '../../constants/analyticsEvents';
import place from '../../constants/places';
import {
  SortDirection,
  TradeFilter as TradeFilterModel,
  TradeModel
} from '../../models/index';
import AnalyticsService from '../../services/analyticsService';
import {
  checkDataForSorting,
  HeaderProps,
  sortData,
  TableHeader,
  TableSortState
} from '../Table';
import {
  ClearFilters,
  Export,
  TradeFilter,
  TradeFilterPeriod,
  TradeFilterType,
  TradeList,
  TradesCellWidth
} from './index';
import {ActionsWrapper, FiltersWrapper, TradeListToolbar} from './styles';

interface TradesProps {
  trades: TradeModel[];
  fetchNextTrades: any;
  shouldFetchMore?: boolean;
  currentFilter: TradeFilterModel;
  onFilter: (filter: string) => void;
}

class Trades extends React.Component<TradesProps, TableSortState> {
  constructor(props: TradesProps) {
    super(props);
    this.state = {
      data: this.props.trades,
      sortByParam: '',
      sortDirection: SortDirection.ASC
    };
  }

  componentWillReceiveProps(args: any) {
    const sortedData = sortData(
      args.trades,
      this.state.sortByParam,
      this.state.sortDirection
    );
    this.setState({
      data: sortedData.data
    });
  }

  sort = (sortByParam: string, sortDirectionDefault: string) => {
    this.setState(
      sortData(this.props.trades, sortByParam, sortDirectionDefault, this.state)
    );
    AnalyticsService.track(
      AnalyticsEvents.ApplySorting(
        place.trades,
        sortByParam,
        sortDirectionDefault
      )
    );
  };

  render() {
    const headers: HeaderProps[] = [
      {
        sortDisabled: checkDataForSorting(this.state.data, 'symbol'),
        key: 'symbol',
        value: 'Asset pair',
        width: TradesCellWidth.Symbol
      },
      {
        sortDisabled: checkDataForSorting(this.state.data, 'price'),
        className: 'right-align',
        key: 'price',
        value: 'Price'
      },
      {
        sortDisabled: checkDataForSorting(this.state.data, 'volume'),
        className: 'right-align',
        key: 'volume',
        value: 'Filled'
      },
      {
        sortDisabled: checkDataForSorting(this.state.data, 'oppositeVolume'),
        className: 'right-align',
        key: 'oppositeVolume',
        value: 'Value'
      },
      {
        sortDisabled: checkDataForSorting(this.state.data, 'timestamp'),
        className: 'right-align',
        key: 'timestamp',
        value: 'Time'
      }
    ];

    return (
      <React.Fragment>
        <TradeListToolbar>
          <FiltersWrapper>
            <TradeFilterPeriod />
            <TradeFilterType />
            <TradeFilter />
          </FiltersWrapper>
          <ActionsWrapper>
            <ClearFilters />
            <Export />
          </ActionsWrapper>
        </TradeListToolbar>
        <HBar />
        <TableHeader
          currentSortDirection={this.state.sortDirection}
          currentSortByParam={this.state.sortByParam}
          headers={headers}
          onSort={this.sort}
        />
        <TradeList trades={this.state.data} />
      </React.Fragment>
    );
  }
}

export default Trades;
