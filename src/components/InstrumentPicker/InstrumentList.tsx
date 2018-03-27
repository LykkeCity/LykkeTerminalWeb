import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import {sortData, TableSortState} from '../Table';
import {
  InstrumentListHeader,
  InstrumentListItem,
  InstrumentListProps
} from './index';
import {Header} from './styles';

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
      <div>
        <Header>
          <InstrumentListHeader
            currentSortDirection={this.state.sortDirection}
            currentSortByParam={this.state.sortByParam}
            sortByParam={'name'}
            onSort={this.sort}
          >
            Asset pair
          </InstrumentListHeader>

          <InstrumentListHeader
            currentSortDirection={this.state.sortDirection}
            currentSortByParam={this.state.sortByParam}
            sortByParam={'price'}
            onSort={this.sort}
          >
            Price
          </InstrumentListHeader>

          <InstrumentListHeader
            className={'right-align'}
            currentSortDirection={this.state.sortDirection}
            currentSortByParam={this.state.sortByParam}
            sortByParam={'change24h'}
            onSort={this.sort}
          >
            24h Change
          </InstrumentListHeader>

          <InstrumentListHeader
            className={'right-align'}
            currentSortDirection={this.state.sortDirection}
            currentSortByParam={this.state.sortByParam}
            sortByParam={'volume'}
            onSort={this.sort}
          >
            Volume
          </InstrumentListHeader>
        </Header>

        <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={525}>
          {this.state.data.map(x => (
            <InstrumentListItem
              key={x.id}
              baseAsset={this.props.baseAsset}
              instrument={x}
              onPick={this.props.onPick}
              inactive={this.props.currentInstrumentId !== x.id}
            />
          ))}
        </Scrollbars>
      </div>
    );
  }
}

export default InstrumentList;
