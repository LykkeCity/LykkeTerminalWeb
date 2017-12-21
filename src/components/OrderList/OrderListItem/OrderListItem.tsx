import * as React from 'react';
import {OrderListItemProps} from '../';
import Dir from '../../../stores/dir';
import Side from '../../../stores/side';
import {Icon} from '../../Icon/index';

const OrderListItem: React.SFC<OrderListItemProps> = ({
  createdDate,
  currentPrice,
  currentPriceSide,
  expiryDate,
  id,
  orderId,
  openPrice,
  side,
  symbol,
  volume
}) => {
  const colorSide = side === Side.Buy ? '#fb8f01' : '#d070ff';
  const colorOpenPrice = currentPriceSide === Dir.Up ? '#13b72a' : '#ff3e2e';

  return (
    <tr key={id}>
      <td>{symbol}</td>
      <td>
        <Icon name="cross" />
      </td>
      <td>{orderId}</td>
      <td style={{color: colorSide}}>{side}</td>
      <td>{volume}</td>
      <td>{openPrice.toFixed(3)}</td>
      <td style={{color: colorOpenPrice}}>{currentPrice.toFixed(3)}</td>
      <td>{createdDate}</td>
      <td>{expiryDate}</td>
      <td>
        <Icon name="pencil" />
      </td>
    </tr>
  );
};

export default OrderListItem;
