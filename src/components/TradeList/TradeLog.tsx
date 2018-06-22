import {pathOr} from 'rambda';
import * as React from 'react';
import {InstrumentModel, SortDirection, TradeModel} from '../../models';
import {LoaderProps} from '../Loader/withLoader';
import {sortData, TableHeader, TableSortState} from '../Table';
import {PublicTradeList} from './';

export interface TradeLogProps extends LoaderProps {
  selectedInstrument: InstrumentModel;
  trades: TradeModel[];
}

class TradeLog extends React.Component<TradeLogProps, TableSortState> {
  constructor(props: TradeLogProps) {
    super(props);
    this.state = {
      data: this.props.trades,
      sortByParam: '',
      sortDirection: SortDirection.ASC
    };
  }

  componentWillReceiveProps(args: any) {
    this.setState({
      data: args.trades
    });
  }

  sort = (sortByParam: string, sortDirectionDefault: string) => {
    this.setState(
      sortData(this.props.trades, sortByParam, sortDirectionDefault, this.state)
    );
  };

  render() {
    const headers: any[] = [
      {
        sortDisabled: true,
        key: 'price',
        value: `Price (${pathOr(
          '',
          ['quoteAsset', 'name'],
          this.props.selectedInstrument
        )})`
      },
      {
        sortDisabled: true,
        className: 'right-align',
        key: 'volume',
        value: 'Trade size'
      },
      {
        sortDisabled: true,
        className: 'right-align',
        key: 'timestamp',
        value: 'Time'
      }
    ];

    return (
      <React.Fragment>
        <TableHeader
          currentSortDirection={this.state.sortDirection}
          currentSortByParam={this.state.sortByParam}
          headers={headers}
          onSort={this.sort}
        />
        <PublicTradeList trades={this.state.data} />
      </React.Fragment>
    );
  }
}

export default TradeLog;
