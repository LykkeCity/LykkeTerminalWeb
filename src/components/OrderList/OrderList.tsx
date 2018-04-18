import * as React from 'react';
import {OrderListItem} from '.';
import {OrderModel} from '../../models';
import {LoaderProps} from '../Loader/withLoader';
import {Table} from '../Table';

export interface OrderListProps extends LoaderProps {
  orders: OrderModel[];
  onEditOrder: (order: OrderModel) => (id: string) => void;
  onCancelOrder?: (id: string) => void;
  getInstrumentById: (id: string) => any;
}

const OrderList: React.SFC<OrderListProps> = ({
  orders,
  onEditOrder,
  onCancelOrder,
  getInstrumentById
}) => (
  <React.Fragment>
    <Table>
      <tbody>
        {orders.map(order => {
          const instrument = getInstrumentById(order.symbol);
          return (
            <OrderListItem
              key={order.id}
              cancelOrder={onCancelOrder}
              onEdit={onEditOrder(order)}
              order={order}
              instrument={instrument}
            />
          );
        })}
      </tbody>
    </Table>
  </React.Fragment>
);

export default OrderList;
