import * as React from 'react';
import {Cell, Table} from '../Table/index';
import {OrderListItem} from './';
import {OrderListProps} from './';

const cellNumber = 9;
const DataCell = Cell(cellNumber);

const OrderList: React.SFC<OrderListProps> = ({orders = []}) => (
  <Table>
    <div className="thead">
      <div className="tr">
        <DataCell className="th">Symbol</DataCell>
        <DataCell className="th">Close</DataCell>
        <DataCell className="th">OrderID</DataCell>
        <DataCell className="th">Side</DataCell>
        <DataCell className="th">Volume</DataCell>
        <DataCell className="th">Current Price</DataCell>
        <DataCell className="th">Created Date</DataCell>
        <DataCell className="th">Expiry Date</DataCell>
        <DataCell className="th">&nbsp;</DataCell>
      </div>
    </div>
    <div className="tbody">
      {orders.map((order: any) => (
        <OrderListItem key={order.orderId} {...order} />
      ))}
    </div>
  </Table>
);

export default OrderList;
