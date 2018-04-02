import * as React from 'react';
import {OrderListItem} from '.';
import {OrderModel} from '../../models';
import {LoaderProps} from '../Loader/withLoader';
import {Table} from '../Table';

export interface OrderListProps extends LoaderProps {
  orders: OrderModel[];
  onEditOrder: (order: OrderModel) => (id: string) => void;
  onCancelOrder?: (id: string) => void;
}

const OrderList: React.SFC<OrderListProps> = ({
  orders,
  onEditOrder,
  onCancelOrder
}) => (
  <React.Fragment>
    <Table>
      <tbody>
        {orders.map(order => (
          <OrderListItem
            key={order.id}
            cancelOrder={onCancelOrder}
            onEdit={onEditOrder(order)}
            {...order}
          />
        ))}
      </tbody>
    </Table>
  </React.Fragment>
);

export default OrderList;
