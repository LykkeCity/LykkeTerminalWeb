import * as React from 'react';
import {OrderModel, Side} from '../../models';
import {Icon} from '../Icon/index';
import {Cell} from '../Table/styles';
import {OrderActions, OrderCellWidth} from './index';

interface OrderListItemProps {
  onEdit: any;
}

const OrderListItem: React.SFC<
  OrderModel & OrderActions & OrderListItemProps
> = ({createdAt, cancelOrder, price, id, side, symbol, volume, onEdit}) => {
  const colorSide = side === Side.Buy ? '#fb8f01' : '#d070ff';
  return (
    <tr>
      <Cell w={OrderCellWidth.Symbol}>{symbol}</Cell>
      <Cell w={OrderCellWidth.CancelOrder}>
        {/* tslint:disable-next-line:jsx-no-lambda */}
        <span onClick={() => cancelOrder!(id)}>
          <Icon name="cross" />
        </span>
      </Cell>
      <Cell w={OrderCellWidth.Id}>{id}</Cell>
      <Cell w={OrderCellWidth.Side} style={{color: colorSide}}>
        {side}
      </Cell>
      <td>{volume}</td>
      <td>{price}</td>
      <Cell w={OrderCellWidth.CreatedDate}>{createdAt.toLocaleString()}</Cell>
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
