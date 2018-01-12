import * as React from 'react';
import {OrderListItemProps} from '../';
import {Side} from '../../../models';
import {Icon} from '../../Icon/index';

const OrderListItem: React.SFC<OrderListItemProps> = ({
  index,
  createdDate,
  currentPrice,
  expiryDate,
  orderId,
  side,
  symbol,
  volume
}) => {
  const colorSide = side === Side.Buy ? '#fb8f01' : '#d070ff';

  return (
    <tr key={index}>
      <td>{symbol}</td>
      <td>
        <Icon name="cross" />
      </td>
      <td>{orderId}</td>
      <td style={{color: colorSide}}>{side}</td>
      <td>{volume}</td>
      <td>{currentPrice.toFixed(3)}</td>
      <td>{createdDate}</td>
      <td>{expiryDate}</td>
      <td>
        <Icon name="pencil" />
      </td>
    </tr>
  );
};

export default OrderListItem;
