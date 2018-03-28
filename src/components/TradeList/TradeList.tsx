import * as React from 'react';
import {TradeListItem} from '.';
import {TradeModel} from '../../models';
import {sortData, Table, TableHeader, TableSortState} from '../Table';

export interface TradeListProps {
  trades: TradeModel[];
}

class TradeList extends React.Component<TradeListProps, TableSortState> {
  constructor(props: TradeListProps) {
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
                sortByParam={'symbol'}
                onSort={this.sort}
              >
                Asset pair
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
                sortByParam={'quantity'}
                onSort={this.sort}
              >
                Volume
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
                Price
              </TableHeader>
            </th>
            <th>
              <TableHeader
                className={'right-align'}
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'oppositeQuantity'}
                onSort={this.sort}
              >
                Opposite volume
              </TableHeader>
            </th>
            <th>
              <TableHeader
                className={'right-align'}
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'orderType'}
                onSort={this.sort}
              >
                Order type
              </TableHeader>
            </th>
            <th>
              <TableHeader
                className={'right-align'}
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'fee'}
                onSort={this.sort}
              >
                Fee
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
            <TradeListItem key={trade.id} {...trade} />
          ))}
        </tbody>
      </Table>
    );
  }
}

export default TradeList;
