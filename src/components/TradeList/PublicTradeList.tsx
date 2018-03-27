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
    return (
      <Table>
        <thead>
          <tr>
            <th>
              <TableHeader
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'quantity'}
                onSort={this.sort}
              >
                Trade size
              </TableHeader>
            </th>
            <th>
              <TableHeader
                className={'right-align'}
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'price'}
                onSort={this.sort}
              >
                Price ({pathOr(
                  '',
                  ['quoteAsset', 'name'],
                  this.props.selectedInstrument
                )})
              </TableHeader>
            </th>
            <th>
              <TableHeader
                className={'right-align'}
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'side'}
                onSort={this.sort}
              >
                Side
              </TableHeader>
            </th>
            <th>
              <TableHeader
                className={'right-align'}
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'timestamp'}
                onSort={this.sort}
              >
                Time
              </TableHeader>
            </th>
          </tr>
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
