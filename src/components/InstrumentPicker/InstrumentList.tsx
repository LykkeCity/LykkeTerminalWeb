import {prop, sortBy} from 'rambda';
import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import styled from '../styled';
import {
  InstrumentListHeader,
  InstrumentListItem,
  InstrumentListProps
} from './index';

interface InstrumentListState {
  data: any[];
  sortBy: string;
  sortDirection: string;
}

const Header = styled.div`
  display: flex;
`;

class InstrumentList extends React.Component<
  InstrumentListProps,
  InstrumentListState
> {
  constructor(props: InstrumentListProps) {
    super(props);
    this.state = {
      data: this.props.instruments,
      sortBy: '',
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
    const sort = sortBy(prop(sortByParam));
    const sortDirection =
      this.state.sortBy === sortByParam
        ? this.state.sortDirection === 'ASC' ? 'DESC' : 'ASC'
        : sortDirectionDefault;
    const data = (() => {
      switch (sortDirection) {
        default:
        case 'ASC':
          return sort(this.props.instruments);
        case 'DESC':
          return sort(this.props.instruments).reverse();
      }
    })();

    return this.setState({
      data,
      sortBy: sortByParam,
      sortDirection
    });
  };

  render() {
    return (
      <div>
        <Header>
          <InstrumentListHeader
            currentSortDirection={this.state.sortDirection}
            currentSortByParam={this.state.sortBy}
            sortByParam={'name'}
            sort={this.sort}
          >
            Asset pair
          </InstrumentListHeader>

          <InstrumentListHeader
            currentSortDirection={this.state.sortDirection}
            currentSortByParam={this.state.sortBy}
            className={'double'}
            sortByParam={'price'}
            sort={this.sort}
          >
            Price
          </InstrumentListHeader>

          <InstrumentListHeader
            currentSortDirection={this.state.sortDirection}
            currentSortByParam={this.state.sortBy}
            className={'right-align'}
            sortByParam={'change24h'}
            sort={this.sort}
          >
            24h Change
          </InstrumentListHeader>

          <InstrumentListHeader
            currentSortDirection={this.state.sortDirection}
            currentSortByParam={this.state.sortBy}
            className={'right-align'}
            sortByParam={'volume'}
            sort={this.sort}
          >
            Volume
          </InstrumentListHeader>
        </Header>

        <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={525}>
          {this.state.data.map(x => (
            <InstrumentListItem
              key={x.id}
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
