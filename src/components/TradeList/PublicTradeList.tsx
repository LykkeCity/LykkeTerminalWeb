import {pathOr} from 'rambda';
import * as React from 'react';
import {InstrumentModel, TradeModel} from '../../models/index';
import {sortData, Table, TableHeader, TableSortState} from '../Table';
import {PublicTradeListItem} from './index';

interface PublicTradeListProps {
  trades: TradeModel[];
  selectedInstrument: InstrumentModel;
}

class PublicTradeList extends React.Component<
  PublicTradeListProps,
  TableSortState
> {
  constructor(props: PublicTradeListProps) {
    super(props);
    this.state = {
      data: this.props.trades,
      sortByParam: '',
      sortDirection: 'ASC'
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
      {key: 'quantity', value: 'Trade size'},
      {
        className: 'right-align',
        key: 'price',
        value: `Price (${pathOr(
          '',
          ['quoteAsset', 'name'],
          this.props.selectedInstrument
        )})`
      },
      {className: 'right-align', key: 'side', value: 'Side'},
      {className: 'right-align', key: 'timestamp', value: 'Time'}
    ];

    return (
      <Table>
        <thead>
          <TableHeader
            backgroundColor={'rgb(51, 51, 51)'}
            currentSortDirection={this.state.sortDirection}
            currentSortByParam={this.state.sortByParam}
            headers={headers}
            onSort={this.sort}
          />
        </thead>
        <tbody>
          {this.state.data.map(trade => (
            <PublicTradeListItem key={trade.id} {...trade} />
          ))}
        </tbody>
      </Table>
    );
  }
}

export default PublicTradeList;
