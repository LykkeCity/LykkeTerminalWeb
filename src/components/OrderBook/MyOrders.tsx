import {join} from 'rambda';
import * as React from 'react';
import {plural} from '../../utils';
import {
  MyOrdersCancelButton,
  MyOrdersCount,
  MyOrdersPopover,
  MyOrdersVolume
} from './styles';

export interface MyOrdersProps {
  position: any;
  orders: any[];
  volume: number;
  onCancel?: (orders: any[]) => () => void;
}

const MyOrders: React.SFC<MyOrdersProps> = ({
  orders,
  volume,
  onCancel,
  ...popoverProps
}) => (
  <MyOrdersPopover show={orders.length > 0} {...popoverProps}>
    <MyOrdersCount>
      {join(' ', [orders.length, plural('order', orders.length)])}
    </MyOrdersCount>
    <MyOrdersVolume>
      <div>{volume}</div>
      <small>Total volume</small>
    </MyOrdersVolume>
    {/* tslint:disable-next-line:jsx-no-lambda */}
    <MyOrdersCancelButton onClick={() => onCancel && onCancel(orders)()}>
      Cancel all orders
    </MyOrdersCancelButton>
  </MyOrdersPopover>
);

export default MyOrders;
