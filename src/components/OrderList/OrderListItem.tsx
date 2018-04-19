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

  const handleEditOrder = () => onEdit(id);

  const handleCancelOrder = () => cancelOrder(id);

  return (
    <tr>
      <Cell w={OrderCellWidth.Symbol}>{displayName}</Cell>
      <Cell w={OrderCellWidth.Id}>{id}</Cell>
      <SideCell w={OrderCellWidth.Side} side={side}>
        {side}
      </SideCell>
      <td>{toLocaleStringWithAccuracy(volume, baseAssetAccuracy)}</td>
      <Cell w={OrderCellWidth.Filled}>
        {toLocaleStringWithAccuracy(filled, baseAssetAccuracy)} ({toLocaleStringWithAccuracy(
          filledPercent,
          2,
          {style: 'percent'}
        )})
      </Cell>
      <td>{toLocaleStringWithAccuracy(price, accuracy)}</td>
      <Cell w={OrderCellWidth.CreatedDate}>{createdAt.toLocaleString()}</Cell>
      <Cell w={OrderCellWidth.Actions}>
        <span onClick={handleEditOrder}>
          <Icon name="pencil" />
        </span>
        <span style={{marginLeft: '0.75rem'}} onClick={handleCancelOrder}>
          <Icon name="cross" />
        </span>
      </Cell>
    </tr>
  );
};

export default OrderListItem;
