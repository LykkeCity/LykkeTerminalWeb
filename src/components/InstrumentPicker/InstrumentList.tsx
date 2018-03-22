import {rem} from 'polished';
import {prop, sortBy} from 'rambda';
import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import styled from '../styled';
import {InstrumentListItem, InstrumentListProps} from './index';

interface InstrumentListState {
  data: any[];
  sortBy: string;
  sortDirection: string;
}

const StyledInstrumentListHeader = styled.div`
  width: ${rem(150)};
  padding: ${rem(10)};
  display: inline-block;
  color: rgba(245, 246, 247, 0.4);

  &.double {
    width: ${rem(300)};
  }
  &.right-align {
    text-align: right;
  }
`;

interface InstrumentListHeaderProps {
  className?: string;
  sort: any;
  sortByParam: string;
  sortDirectionDefault: string;
}

const InstrumentListHeader: React.SFC<InstrumentListHeaderProps> = ({
  sort,
  sortByParam,
  sortDirectionDefault,
  className,
  children
}) => {
  const sortList = () => sort(sortByParam, sortDirectionDefault);

  return (
    <StyledInstrumentListHeader className={className} onClick={sortList}>
      {children}
    </StyledInstrumentListHeader>
  );
};

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
        <InstrumentListHeader
          sortByParam={'name'}
          sortDirectionDefault={'ASC'}
          sort={this.sort}
        >
          Asset pair
        </InstrumentListHeader>

        <InstrumentListHeader
          className={'double'}
          sortByParam={'price'}
          sortDirectionDefault={'ASC'}
          sort={this.sort}
        >
          Price
        </InstrumentListHeader>

        <InstrumentListHeader
          className={'right-align'}
          sortByParam={'change24h'}
          sortDirectionDefault={'ASC'}
          sort={this.sort}
        >
          24h Change
        </InstrumentListHeader>

        <InstrumentListHeader
          className={'right-align'}
          sortByParam={'volume'}
          sortDirectionDefault={'ASC'}
          sort={this.sort}
        >
          Volume
        </InstrumentListHeader>

        <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={555}>
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
