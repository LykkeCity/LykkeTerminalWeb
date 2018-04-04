import {observer} from 'mobx-react';
import * as React from 'react';
import {OrderModel, Side} from '../../models';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {Icon} from '../Icon/index';
import {Cell} from '../Table/styles';
import {OrderActions, OrderCellWidth} from './index';

interface OrderListItemProps {
  onEdit: any;
  order: OrderModel;
  accuracy: number;
  symbol: string;
}

const getFilled = (
  volume: number,
  remainingVolume: number,
  accuracy: number
) => {
  return formattedNumber(volume - remainingVolume, accuracy);
};

const getFilledPercent = (
  volume: number,
  remainingVolume: number,
  accuracy: number
) => {
  return volume - remainingVolume === 0
    ? 0
    : formattedNumber(remainingVolume / volume * 100, accuracy);
};

const OrderListItem: React.SFC<OrderActions & OrderListItemProps> = observer(
  ({
    order: {createdAt, price, id, side, volume, remainingVolume},
    accuracy,
    onEdit,
    symbol,
    cancelOrder
  }) => {
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
        <td>
          {getFilled(volume, remainingVolume, accuracy)}({getFilledPercent(
            volume,
            remainingVolume,
            accuracy
          )}%)
        </td>
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
  }
);

export default OrderListItem;
