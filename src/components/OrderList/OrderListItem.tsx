import * as React from 'react';
import {InstrumentModel, OrderModel} from '../../models';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {Icon} from '../Icon/index';
import {Cell} from '../Table/styles';
import {SideCell} from '../TradeList/styles';
import {OrderActions, OrderCellWidth} from './index';

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
  instrument: {displayName, accuracy, baseAsset: {accuracy: baseAssetAccuracy}}
}) => {
  const handleEditOrder = () => onEdit(id);
  const handleCancelOrder = () => cancelOrder(id);
  return (
    <tr>
      <Cell w={OrderCellWidth.Symbol}>{displayName}</Cell>
      <Cell w={OrderCellWidth.Id}>{id}</Cell>
      <SideCell w={OrderCellWidth.Side} side={side}>
        {side}
      </SideCell>
      <Cell w={OrderCellWidth.Volume}>
        {formattedNumber(volume, baseAssetAccuracy)}
      </Cell>
      <Cell w={OrderCellWidth.Filled}>
        {formattedNumber(filled, baseAssetAccuracy)} ({formattedNumber(
          filledPercent,
          2,
          {style: 'percent'}
        )})
      </Cell>
      <td>{formattedNumber(price)}</td>
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
