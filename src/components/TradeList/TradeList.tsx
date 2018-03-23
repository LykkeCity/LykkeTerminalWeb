import {curry, pathOr} from 'rambda';
import * as React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {TradeListCell} from '.';
import {InstrumentModel, TradeModel} from '../../models';
import {formattedDateTime} from '../../utils/localFormatted/localFormatted';
import {ReactStyledTable} from '../Table';

const assetFromInstrument = (instrument: InstrumentModel, assetType: string) =>
  pathOr('', [assetType, 'name'], instrument);

export interface TradeListProps {
  trades: TradeModel[];
  selectedInstrument: InstrumentModel | null;
}

const TradeList: React.SFC<TradeListProps> = ({
  trades = [],
  selectedInstrument
}) => {
  const columns = [
    {
      Cell: (props: any) => (
        <TradeListCell side={props.original.side}>
          {props.original.symbol}
        </TradeListCell>
      ),
      Header: 'Asset pair',
      accessor: 'symbol',
      className: 'left-align no-border',
      headerClassName: 'left-align header no-border',
      minWidth: 65
    },
    {
      Cell: (row: any) => (
        <TradeListCell side={row.value}>{row.value}</TradeListCell>
      ),
      Header: 'Side',
      accessor: 'side',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 40
    },
    {
      Cell: (props: any) => (
        <TradeListCell side={props.original.side}>
          {props.original.quantity}
        </TradeListCell>
      ),
      Header: () => `Volume (${assetFromSelectedInstrument('baseAsset')})`,
      accessor: 'quantity',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 65
    },
    {
      Cell: (props: any) => (
        <TradeListCell side={props.original.side}>
          {props.original.price}
        </TradeListCell>
      ),
      Header: 'Price',
      accessor: 'price',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 60
    },
    {
      Cell: (props: any) => (
        <TradeListCell side={props.original.side}>
          {props.original.oppositeQuantity}
        </TradeListCell>
      ),
      Header: () => `Volume (${assetFromSelectedInstrument('quoteAsset')})`,
      accessor: 'oppositeQuantity',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 60
    },
    {
      Cell: (props: any) => (
        <TradeListCell side={props.original.side}>
          {props.original.orderType}
        </TradeListCell>
      ),
      Header: 'Order type',
      accessor: 'orderType',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 50
    },
    {
      Cell: (props: any) => (
        <TradeListCell side={props.original.side}>
          {props.original.fee}
        </TradeListCell>
      ),
      Header: 'Fee',
      accessor: 'fee',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 50
    },
    {
      Cell: (props: any) => (
        <TradeListCell side={props.original.side}>
          {formattedDateTime(new Date(props.original.timestamp))}
        </TradeListCell>
      ),
      Header: 'Time',
      accessor: 'timestamp',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 140,
      maxWidth: 170
    }
  ];
  const assetFromSelectedInstrument = curry(assetFromInstrument)(
    selectedInstrument!
  );

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

export default TradeList;
