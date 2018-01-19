import * as React from 'react';
import {OrderModel, Side} from '../../models';
import {Icon} from '../Icon/index';
import {OrderActions} from './index';

const OrderListItem: React.SFC<OrderModel & OrderActions> = ({
  createdAt,
  cancelOrder,
  price,
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
        {/* tslint:disable-next-line:jsx-no-lambda */}
        <span onClick={() => cancelOrder!(id)}>
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
