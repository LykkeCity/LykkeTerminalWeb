import * as React from 'react';
import styled from '../styled';
import {OrderModel} from '../../models/index';
import {rem} from 'polished';
import {Table} from '../Table/index';
import {OrderListItem} from './';

interface OrderListProps {
  orders?: OrderModel[];
  cancelOrder?: (id: string) => any;
  cancelAll: () => any;
}

const StyledSpan = styled.div`
  float: right;
  padding: ${rem(8)} ${rem(18)};
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: #ccc;
  &:hover {
    color: #fff;
    cursor: pointer;
  }
`;

const OrderList: React.SFC<OrderListProps> = ({
  orders = [],
  cancelAll,
  cancelOrder
}) => (
  <Table>
    <thead>
      <tr>
        <th colSpan={7}>
          <StyledSpan onClick={cancelAll}>Cancel all orders</StyledSpan>
        </th>
      </tr>
      <tr>
        <th>Symbol</th>
        <th>Close</th>
        <th>OrderID</th>
        <th>Side</th>
        <th>Volume</th>
        <th>Price</th>
        <th>Created Date</th>
      </tr>
    </thead>
    <tbody>
      {orders.map(order => {
        order.cancelOrder = cancelOrder;
        return <OrderListItem key={order.id} {...order} />;
      })}
    </tbody>
  </Table>
);

export default OrderList;
