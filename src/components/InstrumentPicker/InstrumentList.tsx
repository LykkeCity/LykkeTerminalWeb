import * as React from 'react';
import {sortData, TableHeader, TableSortState} from '../Table';
import {InstrumentListProps, InstrumentTable} from './index';

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
    const headers = [
      {key: 'displayName', value: 'Asset pair'},
      {key: 'price', value: 'Price'},
      {className: 'right-align', key: 'change24h', value: '24h Change'},
      {className: 'right-align', key: 'volume', value: 'Volume'}
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
        />
      </React.Fragment>
    );
  }
}

export default InstrumentList;
