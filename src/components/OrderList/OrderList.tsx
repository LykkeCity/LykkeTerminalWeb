import * as React from 'react';
import {OrderModel} from '../../models/index';
import {Cell, Table} from '../Table/index';
import {OrderListItem} from './';

interface OrderListProps {
  orders?: OrderModel[];
}

const cellNumber = 7;
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
        <DataCell className="th">Price</DataCell>
        <DataCell className="th">Created Date</DataCell>
      </div>
    </div>
    <div className="tbody">
      {orders.map(order => <OrderListItem key={order.id} {...order} />)}
    </div>
  </Table>
);

export default OrderList;
