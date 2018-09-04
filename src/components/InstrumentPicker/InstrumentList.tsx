import * as React from 'react';
import {AnalyticsEvents} from '../../constants/analyticsEvents';
import {AssetModel, InstrumentModel} from '../../models';
import SortDirection from '../../models/sortDirection';
import {AnalyticsService} from '../../services/analyticsService';
import {
  checkDataForSorting,
  HeaderProps,
  sortData,
  TableHeader,
  TableSortState
} from '../Table';
import {InstrumentTable} from './index';

export interface InstrumentListProps {
  baseAsset: AssetModel;
  currentInstrumentId: string;
  instruments: InstrumentModel[];
  onPick: any;
  isAuth: boolean;
  setInstrumentPickerSortingParameters: (
    sortByParam: string,
    direction: string,
    state: any
  ) => void;
  defaultSortingField: string;
  searchValue: string;
  getInstrumentPickerSortingParameters: () => {
    sortByParam: string;
    direction: string;
    state: TableSortState;
  };
}

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

  componentWillReceiveProps(args: InstrumentListProps) {
    this.setState(this.sortPickerInstruments(args.instruments));
  }

  componentDidMount() {
    this.setState(this.sortPickerInstruments(this.props.instruments));
  }

  sortPickerInstruments = (
    instruments: InstrumentModel[],
    state?: TableSortState,
    param?: string,
    sortDirection?: string
  ) => {
    const pickerParams = this.props.getInstrumentPickerSortingParameters();
    const sortByParam = param || pickerParams.sortByParam;
    const direction = sortDirection || pickerParams.direction;

    const instrumentsToBeSorted = instruments.filter(i => !!i[sortByParam]);
    const shouldNotBeSorted = instruments.filter(i => !i[sortByParam]);
    const stateObjWithSortedInstruments = sortData(
      instrumentsToBeSorted,
      sortByParam,
      direction,
      state || pickerParams.state
    );
    stateObjWithSortedInstruments.data = [
      ...stateObjWithSortedInstruments.data,
      ...shouldNotBeSorted
    ];
    return stateObjWithSortedInstruments;
  };

  sort = (sortByParam: string, sortDirection: string) => {
    const direction =
      this.state.sortByParam === sortByParam
        ? sortDirection
        : SortDirection.DESC;

    const stateObjWithSortedInstruments = this.sortPickerInstruments(
      this.props.instruments,
      this.state,
      sortByParam,
      direction
    );
    this.setState(stateObjWithSortedInstruments);

    this.props.setInstrumentPickerSortingParameters(
      sortByParam,
      stateObjWithSortedInstruments.sortDirection,
      this.state
    );

    AnalyticsService.handleClick(
      AnalyticsEvents.InstrumentPickerSort(sortByParam, sortDirection)
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
