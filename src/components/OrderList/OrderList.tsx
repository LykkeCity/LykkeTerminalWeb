import {pathOr} from 'rambda';
import * as React from 'react';
import {OrderListItem} from '.';
import {OrderModel} from '../../models';
import {LoaderProps} from '../Loader/withLoader';
import {sortData, Table, TableHeader, TableSortState} from '../Table';
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
          const asset = getInstrumentById(order.symbol);
          return (
            <OrderListItem
              key={order.id}
              cancelOrder={onCancelOrder}
              onEdit={onEditOrder(order)}
              order={order}
              accuracy={pathOr(2, ['baseAsset', 'accuracy'], asset)}
              symbol={pathOr('', ['displayName'], asset)}
            />
          );
        })}
      </tbody>
    </Table>
  </React.Fragment>
);

export default OrderList;
