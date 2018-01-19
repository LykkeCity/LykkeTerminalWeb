import * as React from 'react';
import {OrderModel, Side} from '../../models';
import {Icon} from '../Icon/index';
import {OrderActions} from './index';

interface OrderListItemProps extends OrderModel, OrderActions {}

const OrderListItem: React.SFC<OrderListItemProps> = ({
  createdAt,
  onCancel,
  price,
  id,
  side,
  symbol,
  volume
}) => {
  const colorSide = side === Side.Buy ? '#fb8f01' : '#d070ff';
  const cancel = () => {
    onCancel!(id);
  };
  return (
    <tr>
      <td>{symbol}</td>
      <td>
        <span onClick={cancel}>
          <Icon name="cross" />
        </span>
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
