import * as React from 'react';
import {OrderModel, Side} from '../../models';
import {Icon} from '../Icon/index';
import {OrderActions} from './index';

interface OrderListItemProps extends OrderModel, OrderActions {}

const OrderListItem: React.SFC<OrderListItemProps> = ({
  createdAt,
  price,
  expiredAt,
  id,
  side,
  symbol,
  volume
}) => {
  const colorSide = side === Side.Buy ? '#fb8f01' : '#d070ff';
  return (
    <tr>
      <td>{symbol}</td>
      <td>
        <Icon name="cross" />
      </td>
      <td>{id}</td>
      <td style={{color: colorSide}}>{side}</td>
      <td>{volume}</td>
      <td>{price}</td>
      <td>{createdAt.toLocaleString()}</td>
    </tr>
  );
};

export default OrderListItem;
