import * as React from 'react';
import {sortData, TableHeader, TableSortState} from '../Table';
import {InstrumentListItem, InstrumentListProps} from './index';
import {InstrumentTable} from './styles';

class InstrumentList extends React.Component<
  InstrumentListProps,
  TableSortState
> {
  private headers: any[] = [
    {key: 'name', value: 'Asset pair'},
    {key: 'price', value: 'Price'},
    {className: 'right-align', key: 'change24h', value: '24h Change'},
    {className: 'right-align', key: 'volume', value: 'Volume'}
  ];

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
          <TableHeader
            backgroundColor={'rgb(60, 60, 60)'}
            currentSortDirection={this.state.sortDirection}
            currentSortByParam={this.state.sortByParam}
            headers={this.headers}
            onSort={this.sort}
          />
        </thead>
        <tbody>
          {this.state.data.map((instrument: any) => (
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
