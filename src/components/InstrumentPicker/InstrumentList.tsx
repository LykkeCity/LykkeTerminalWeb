import * as React from 'react';
import {SortDirection} from '../../models';
import {
  checkDataForSorting,
  HeaderProps,
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

    const {instruments, defaultSortingField} = this.props;

    const sortedInstruments = instruments.sort(
      (a, b) => (b[defaultSortingField] || 0) - (a[defaultSortingField] || 0)
    );

    this.state = {
      data: sortedInstruments,
      sortByParam: defaultSortingField,
      sortDirection: SortDirection.DESC
    };
  }

  componentWillReceiveProps(args: any) {
    this.setState({
      data: args.instruments
    });
  }

  componentDidMount() {
    this.props.change();
    const {
      sortByParam,
      direction,
      state
    } = this.props.getInstrumentPickerSortingParameters();
    this.setState(
      sortData(this.props.instruments, sortByParam, direction, state)
    );
  }

  sort = (sortByParam: string, sortDirection: string) => {
    const direction =
      this.state.sortByParam === sortByParam
        ? sortDirection
        : SortDirection.DESC;
    const instrumentsToBeSorted = this.props.instruments.filter(
      i => !!i[sortByParam]
    );
    const shouldNotBeSorted = this.props.instruments.filter(
      i => !i[sortByParam]
    );
    const stateObjWithSortedInstruments = sortData(
      instrumentsToBeSorted,
      sortByParam,
      direction,
      this.state
    );
    stateObjWithSortedInstruments.data = [
      ...stateObjWithSortedInstruments.data,
      ...shouldNotBeSorted
    ];

    this.setState(stateObjWithSortedInstruments);

    this.props.setInstrumentPickerSortingParameters(
      sortByParam,
      direction,
      this.state
    );
  };

  render() {
    const headers: HeaderProps[] = [
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
        sortDisabled: checkDataForSorting(
          this.state.data,
          this.props.isAuth ? 'volumeInBase' : 'volume'
        ),
        className: 'right-align',
        key: this.props.isAuth ? 'volumeInBase' : 'volume',
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
