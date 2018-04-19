import * as React from 'react';
import {supportedDesignedIcons} from '../../constants/navigatorInfo';
import {OrderModel, Side} from '../../models';
import {FAIcon} from '../Icon/Icon';
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
  return (
    <tr>
      <td>{symbol}</td>
      <td>
        {/* tslint:disable-next-line:jsx-no-lambda */}
        <span onClick={() => cancelOrder!(id)}>
          {supportedDesignedIcons ? (
            <Icon name="cross" />
          ) : (
            <FAIcon name="times" />
          )}
        </span>
      </td>
      <td>{id}</td>
      <td style={{color: colorSide}}>{side}</td>
      <td>{volume}</td>
      <td>{price}</td>
      <td>{createdAt.toLocaleString()}</td>
      <td>
        {/* tslint:disable-next-line:jsx-no-lambda */}
        <span onClick={() => onEdit(id)}>
          {supportedDesignedIcons ? (
            <Icon name="pencil" />
          ) : (
            <FAIcon name="pencil-alt" />
          )}
        </span>
      </td>
    </tr>
  );
};

export default OrderListItem;
