import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import styled from 'styled-components';
import {InstrumentListNumber, InstrumentListProps} from './index';

const StyledInstruments = styled.div`
  overflow: auto;
  max-height: 570px;
  .table {
    margin-right: 10px;
  }
  .no-border {
    border: none !important;
  }
  .header {
    padding: 10px 0 !important;
    color: rgba(245, 246, 247, 0.4);
    outline: none;
    &.-sort-asc {
      box-shadow: inset 0 3px 0 0 rgb(51, 51, 51) !important;
    }
    &.-sort-desc {
      box-shadow: inset 0 -3px 0 0 rgb(51, 51, 51) !important;
    }
  }
  .left-align {
    text-align: left;
  }
  .right-align {
    text-align: right;
  }
`;

class InstrumentList extends React.Component<InstrumentListProps> {
  componentDidMount() {
    this.props.change();
  }

  render() {
    const percentageAccuracy = 3;
    const click = (state: any, rowInfo: any) => {
      return {
        onClick: (e: any) => {
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

    return (
      <StyledInstruments>
        <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={570}>
          <ReactTable
            data={data}
            columns={[
              {
                Header: 'Asset pair',
                accessor: 'name',
                className: 'left-align no-border',
                headerClassName: 'left-align header no-border'
              },
              {
                Cell: props => (
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
                Cell: props => (
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
                Cell: props => (
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
                Cell: props => (
                  <InstrumentListNumber
                    num={props.value}
                    accuracy={percentageAccuracy}
                  >
                    &nbsp;{props.original.name.match(/\w*$/i)[0]}
                  </InstrumentListNumber>
                ),
                Header: 'Volume',
                accessor: 'volume',
                className: 'right-align',
                headerClassName: 'right-align header no-border '
              }
            ]}
            className={'-highlight no-border table'}
            showPagination={false}
            defaultPageSize={data.length}
            getTdProps={click}
          />
        </Scrollbars>
      </StyledInstruments>
    );
  }
}

export default InstrumentList;
