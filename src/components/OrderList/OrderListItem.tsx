import {observer} from 'mobx-react';
import * as React from 'react';
import {InstrumentModel, OrderModel} from '../../models';
import {toLocaleStringWithAccuracy} from '../../utils/string';
import {Icon} from '../Icon/index';
import {Cell} from '../Table/styles';
import {OrderActions, OrderCellWidth} from './index';
import {SideCell} from './styles';

interface OrderListItemProps {
  onEdit: any;
  order: OrderModel;
  instrument: InstrumentModel;
}

const getFilled = (filled: number, accuracy: number) => {
  return toLocaleStringWithAccuracy(filled, accuracy);
};

const getFilledPercent = (
  filled: number,
  filledPercent: number,
  accuracy: number
) => {
  return filled === 0
    ? 0
    : toLocaleStringWithAccuracy(filledPercent * 100, accuracy, {
        style: 'percent'
      });
};

const OrderListItem: React.SFC<OrderActions & OrderListItemProps> = ({
  order: {
    createdAt,
    price,
    id,
    side,
    volume,
    remainingVolume,
    filled,
    filledPercent
  },
  onEdit,
  cancelOrder,
  instrument
}) => {
  const {
    accuracy,
    displayName,
    baseAsset: {accuracy: baseAssetAccuracy}
  } = instrument;

  return (
    <tr>
      <Cell w={OrderCellWidth.Symbol}>{displayName}</Cell>
      <Cell w={OrderCellWidth.CancelOrder}>
        {/* tslint:disable-next-line:jsx-no-lambda */}
        <span onClick={() => cancelOrder!(id)}>
          <Icon name="cross" />
        </span>
      </Cell>
      <Cell w={OrderCellWidth.Id}>{id}</Cell>
      <SideCell w={OrderCellWidth.Side} side={side}>
        {side}
      </SideCell>
      <td>{toLocaleStringWithAccuracy(volume, baseAssetAccuracy)}</td>
      <Cell w={OrderCellWidth.Filled}>
        {getFilled(filled, baseAssetAccuracy)} ({getFilledPercent(
          filled,
          filledPercent,
          baseAssetAccuracy
        )}%)
      </Cell>
      <td>{toLocaleStringWithAccuracy(price, accuracy)}</td>
      <Cell w={OrderCellWidth.CreatedDate}>{createdAt.toLocaleString()}</Cell>
      <Cell w={OrderCellWidth.Edit}>
        {/* tslint:disable-next-line:jsx-no-lambda */}
        <span onClick={() => onEdit(id)}>
          <Icon name="pencil" />
        </span>
      </Cell>
    </tr>
  );
};

export default observer(OrderListItem);
