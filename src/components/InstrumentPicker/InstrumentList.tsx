import * as React from 'react';
import {sortData, TableHeader, TableSortState} from '../Table';
import {InstrumentListItem, InstrumentListProps} from './index';
import {InstrumentTable} from './styles';

class InstrumentList extends React.Component<
  InstrumentListProps,
  TableSortState
> {
  constructor(props: InstrumentListProps) {
    super(props);
    this.state = {
      data: this.props.instruments,
      sortByParam: '',
      sortDirection: 'ASC'
    };
  }

  componentDidMount() {
    this.props.change();
  }

  componentWillReceiveProps(args: any) {
    this.setState({
      data: args.instruments
    });
  }

  sort = (sortByParam: string, sortDirectionDefault: string) => {
    this.setState(
      sortData(
        this.props.instruments,
        sortByParam,
        sortDirectionDefault,
        this.state
      )
    );
  };

  render() {
    return (
      <InstrumentTable>
        <thead>
          <tr>
            <th>
              <TableHeader
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'name'}
                onSort={this.sort}
              >
                Asset pair
              </TableHeader>
            </th>
            <th>
              <TableHeader
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
                sortByParam={'change24h'}
                onSort={this.sort}
              >
                24h Change
              </TableHeader>
            </th>
            <th>
              <TableHeader
                className={'right-align'}
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'volume'}
                onSort={this.sort}
              >
                Volume
              </TableHeader>
            </th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.map(instrument => (
            <InstrumentListItem
              key={instrument.id}
              baseAsset={this.props.baseAsset}
              onPick={this.props.onPick}
              inactive={this.props.currentInstrumentId !== instrument.id}
              instrument={instrument}
            />
          ))}
        </tbody>
      </InstrumentTable>
    );
  }
}

export default InstrumentList;
