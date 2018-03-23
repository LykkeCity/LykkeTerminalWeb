import * as React from 'react';
import {OrderModel, Side} from '../../models';
import {
  formattedDateTime,
  formattedNumber
} from '../../utils/localFormatted/localFormatted';
import {Icon} from '../Icon/index';
import {OrderActions, OrderListProps} from './index';

const OrderListItem: React.SFC<OrderModel & OrderActions & OrderListProps> = ({
  createdAt,
  cancelOrder,
  price,
  id,
  side,
  symbol,
  volume,
  onEdit
}) => {
  const colorSide = side === Side.Buy ? '#fb8f01' : '#d070ff';
  const dateTime = new Date(createdAt);
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
      <td>{formattedNumber(volume)}</td>
      <td>{formattedNumber(price)}</td>
      <td>{formattedDateTime(dateTime)}</td>
      <td>
        {/* tslint:disable-next-line:jsx-no-lambda */}
        <span onClick={() => onEdit(id)}>
          <Icon name="pencil" />
        </span>
      </td>
    </tr>
  );
};

export default OrderListItem;
