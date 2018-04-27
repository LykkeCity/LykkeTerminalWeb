import * as React from 'react';
import {SortDirections} from '../../models';
import {
  checkDataForSorting,
  sortData,
  TableHeader,
  TableSortState
} from '../Table';
import {InstrumentListProps, InstrumentTable} from './index';

class InstrumentList extends React.Component<
  InstrumentListProps,
  TableSortState
> {
  constructor(props: InstrumentListProps) {
    super(props);
    this.state = {
      data: this.props.instruments,
      sortByParam: 'volumeInBase',
      sortDirection: SortDirections.DESC
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
    const sortDirection =
      this.state.sortByParam === sortByParam
        ? sortDirectionDefault
        : SortDirections.DESC;
    this.setState(
      sortData(this.props.instruments, sortByParam, sortDirection, this.state)
    );
  };

  render() {
    const headers = [
      {
        sortDisabled: checkDataForSorting(this.state.data, 'displayName'),
        key: 'displayName',
        value: 'Asset pair'
      },
      {
        sortDisabled: checkDataForSorting(this.state.data, 'price'),
        key: 'price',
        value: 'Price'
      },
      {
        sortDisabled: checkDataForSorting(this.state.data, 'change24h'),
        className: 'right-align',
        key: 'change24h',
        value: '24h Change'
      },
      {sortDisabled: true, className: 'right-align', key: '', value: ''},
      {
        sortDisabled: checkDataForSorting(this.state.data, 'volumeInBase'),
        className: 'right-align',
        key: 'volumeInBase',
        value: 'Volume'
      }
    ];

    return (
      <React.Fragment>
        <TableHeader
          className={'instruments'}
          currentSortDirection={this.state.sortDirection}
          currentSortByParam={this.state.sortByParam}
          headers={headers}
          onSort={this.sort}
        />

        <InstrumentTable
          instruments={this.state.data}
          baseAsset={this.props.baseAsset}
          currentInstrumentId={this.props.currentInstrumentId}
          onPick={this.props.onPick}
          isAuth={this.props.isAuth}
        />
      </React.Fragment>
    );
  }
}

export default InstrumentList;
