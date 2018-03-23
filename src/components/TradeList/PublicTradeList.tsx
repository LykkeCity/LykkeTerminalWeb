import {format} from 'date-fns';
import {pathOr} from 'rambda';
import * as React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {InstrumentModel, TradeModel} from '../../models/index';
import {ReactStyledTable} from '../Table/index';
import {TradeListCell} from './index';

interface PublicTradeListProps {
  trades: TradeModel[];
  selectedInstrument: InstrumentModel;
}

export const PublicTradeList: React.SFC<PublicTradeListProps> = ({
  trades = [],
  selectedInstrument
}) => {
  const columns = [
    {
      Cell: (props: any) => (
        <TradeListCell side={props.original.side}>
          {props.original.quantity}
        </TradeListCell>
      ),
      Header: 'Trade size',
      accessor: 'quantity',
      className: 'left-align no-border',
      headerClassName: 'left-align header no-border',
      minWidth: 90
    },
    {
      Cell: (props: any) => (
        <TradeListCell side={props.original.side}>
          {props.original.price}
        </TradeListCell>
      ),
      Header: () =>
        `Price (${pathOr('', ['quoteAsset', 'name'], selectedInstrument)})`,
      accessor: 'price',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 75
    },
    {
      Cell: (row: any) => (
        <TradeListCell side={row.value}>{row.value}</TradeListCell>
      ),
      Header: 'Side',
      accessor: 'side',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 40,
      resizable: false
    },
    {
      Cell: (props: any) => (
        <TradeListCell side={props.original.side}>
          {format(props.original.timestamp, 'HH:mm:ss')}
        </TradeListCell>
      ),
      Header: 'Time',
      accessor: 'timestamp',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 60
    }
  ];

  return (
    <ReactStyledTable>
      <ReactTable
        data={trades}
        columns={columns}
        className={'no-border table'}
        showPagination={false}
        pageSize={trades.length}
      />
    </ReactStyledTable>
  );
};

export default PublicTradeList;
