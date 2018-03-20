import {observer} from 'mobx-react';
import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import styled from '../styled';
import {ReactStyledTable} from '../Table/index';
import {InstrumentListNumber, InstrumentListProps} from './index';

const InstrumentsReactTable = styled(ReactStyledTable)`
  .table {
    margin-right: 10px;
  }
`;

const ObservedTable: React.SFC = observer(({children}) => {
  return <div>{children}</div>;
});

class InstrumentList extends React.Component<InstrumentListProps> {
  componentDidMount() {
    this.props.change();
  }

  render() {
    const percentageAccuracy = 3;
    const click = (state: any, rowInfo: any) => {
      return {
        onClick: () => {
          if (
            this.props.currentInstrumentId !== rowInfo.original.id &&
            this.props.onPick
          ) {
            this.props.onPick(rowInfo.original);
          }
        }
      };
    };

    const data = [...this.props.instruments];
    const columns = [
      {
        Header: 'Asset pair',
        accessor: 'name',
        className: 'left-align no-border',
        headerClassName: 'left-align header no-border'
      },
      {
        Cell: (props: any) => (
          <InstrumentListNumber
            num={props.value}
            accuracy={props.original.accuracy}
          />
        ),
        Header: 'Price',
        accessor: 'price',
        className: 'left-align no-border',
        headerClassName: 'left-align header no-border',
        resizable: false
      },
      {
        Cell: (props: any) => (
          <InstrumentListNumber
            num={props.value}
            accuracy={this.props.baseAsset.accuracy}
            color={'rgba(245, 246, 247, 0.4)'}
          >
            &nbsp;{this.props.baseAsset.name}
          </InstrumentListNumber>
        ),
        Header: '',
        accessor: 'priceInBase',
        className: 'left-align no-border',
        headerClassName: 'header no-border'
      },
      {
        Cell: (props: any) => (
          <InstrumentListNumber
            num={props.value}
            accuracy={percentageAccuracy}
            dynamics={props.value >= 0 ? 'up' : 'down'}
            preSign={props.value >= 0 ? '+' : ''}
          >
            %
          </InstrumentListNumber>
        ),
        Header: '24h Change',
        accessor: 'change24h',
        className: 'right-align no-border',
        headerClassName: 'right-align header no-border'
      },
      {
        Cell: (props: any) => (
          <InstrumentListNumber num={props.value} accuracy={percentageAccuracy}>
            &nbsp;{props.original.name.match(/\w*$/i)[0]}
          </InstrumentListNumber>
        ),
        Header: 'Volume',
        accessor: 'volume',
        className: 'right-align',
        headerClassName: 'right-align header no-border '
      }
    ];

    return (
      <InstrumentsReactTable>
        <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={555}>
          <ObservedTable>
            <ReactTable
              data={data}
              columns={columns}
              className={'-highlight no-border table'}
              showPagination={false}
              pageSize={data.length}
              getTdProps={click}
            />
          </ObservedTable>
        </Scrollbars>
      </InstrumentsReactTable>
    );
  }
}

export default InstrumentList;
