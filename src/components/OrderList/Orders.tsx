import * as React from 'react';
import Types from '../../models/modals';
import {HBar} from '../Bar';
import {Table} from '../Table';
import {HeaderCell} from '../Table/styles';
import {OrderActions, OrderCellWidth, OrderList} from './';
import {CancelAllOrders, ToggleOrders} from './OrderListAdditional';
import OrderListToolbar from './OrderListToolbar';

interface OrdersProps extends OrderActions {
  addModal: any;
}

const Blotter: React.SFC<OrdersProps> = ({cancelOrder, addModal}) => {
  const handleEditOrder = (order: any) => (id: string) => {
    addModal(
      id,
      // tslint:disable-next-line:no-empty
      () => {},
      // tslint:disable-next-line:no-empty
      () => {},
      Types.EditOrder,
      order
    );
  };

  return (
    <React.Fragment>
      <OrderListToolbar>
        <ToggleOrders />
        <CancelAllOrders />
      </OrderListToolbar>
      <HBar />
      <Table>
        <thead>
          <tr>
            <HeaderCell w={OrderCellWidth.Symbol}>Asset pair</HeaderCell>
            <HeaderCell w={OrderCellWidth.CancelOrder}>Cancel order</HeaderCell>
            <HeaderCell w={OrderCellWidth.Id}>OrderID</HeaderCell>
            <HeaderCell w={OrderCellWidth.Side}>Side</HeaderCell>
            <th>Volume</th>
            <th>Filled</th>
            <th>Price</th>
            <HeaderCell w={OrderCellWidth.CreatedDate}>Created Date</HeaderCell>
            <th>Edit</th>
          </tr>
        </thead>
      </Table>
      <OrderList onEditOrder={handleEditOrder} onCancelOrder={cancelOrder} />
    </React.Fragment>
  );
};

export default Blotter;
