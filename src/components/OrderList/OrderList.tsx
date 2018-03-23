import * as React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {OrderModel, Side} from '../../models';
import {
  formattedDateTime,
  formattedNumber
} from '../../utils/localFormatted/localFormatted';
import {Icon} from '../Icon/index';
import {ReactStyledTable} from '../Table';

interface OrderListProps {
  orders: OrderModel[];
  onEditOrder: (order: OrderModel) => void;
  onCancelOrder?: (id: string) => void;
}

const OrderList: React.SFC<OrderListProps> = ({
  orders,
  onEditOrder,
  onCancelOrder
}) => {
  const columns = [
    {
      Header: 'Asset pair',
      accessor: 'symbol',
      className: 'left-align no-border',
      headerClassName: 'left-align header no-border',
      minWidth: 65
    },
    {
      Cell: (props: any) => (
        // tslint:disable-next-line:jsx-no-lambda
        <span onClick={() => onCancelOrder!(props.original.id)}>
          <Icon name="cross" />
        </span>
      ),
      Header: 'Cancel order',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 55
    },
    {
      Header: 'OrderID',
      accessor: 'id',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 280
    },
    {
      Cell: (props: any) => {
        const colorSide =
          props.original.side === Side.Buy ? '#fb8f01' : '#d070ff';
        return <span style={{color: colorSide}}>{props.original.side}</span>;
      },
      Header: 'Side',
      accessor: 'side',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 40
    },
    {
      Cell: (row: any) => <span>{formattedNumber(row.value)}</span>,
      Header: 'Volume',
      accessor: 'volume',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 60
    },
    {
      Cell: (row: any) => <span>{formattedNumber(row.value)}</span>,
      Header: 'Price',
      accessor: 'price',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 45
    },
    {
      Cell: (row: any) => {
        return <span>{formattedDateTime(new Date(row.value))}</span>;
      },
      Header: 'Created Date',
      accessor: 'createdAt',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 155
    },
    {
      Cell: (props: any) => (
        // tslint:disable-next-line:jsx-no-lambda
        <span onClick={() => onEditOrder(props.original)}>
          <Icon name="pencil" />
        </span>
      ),
      Header: 'Edit',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 40,
      resizable: false
    }
  ];

  return (
    <ReactStyledTable>
      <ReactTable
        data={orders}
        columns={columns}
        className={'no-border table'}
        showPagination={false}
        pageSize={orders.length}
      />
    </ReactStyledTable>
  );
};

export default OrderList;
