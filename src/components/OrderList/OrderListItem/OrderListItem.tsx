import * as React from 'react';
import Side from '../../../stores/enums/side';
import {Icon} from '../../Icon/index';
import OrderListInterface from './OrderListItemInterface';

const OrderListItem: React.SFC<OrderListInterface> = ({
  createdDate,
  currentPrice,
  currentPriceSide,
  expiryDate,
  id,
  orderID,
  openPrice,
  side,
  symbol,
  volume
}) => {
  const colorSide = side === Side.Buy ? '#fb8f01' : '#d070ff';
  const colorOpenPrice = currentPriceSide === Side.Up ? '#13b72a' : '#ff3e2e';

  return (
    <tr key={id}>
      <td>{symbol}</td>
      <td>
        <Icon name="cross" />
      </td>
      <td>{orderID}</td>
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
