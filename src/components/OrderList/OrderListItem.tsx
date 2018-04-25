import * as React from 'react';
import {InstrumentModel, OrderModel, Side} from '../../models';
import {precisionCeil, precisionFloor} from '../../utils/math';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {toLocaleStringWithAccuracy} from '../../utils/string';
import {Icon} from '../Icon/index';
import {Cell} from '../Table/styles';
import TitledCell from '../Table/TitledCell';
import {SideCell} from '../TradeList/styles';
import {OrderActions, OrderCellWidth} from './index';

interface OrderListItemProps {
  onEdit: any;
  order: OrderModel;
  instrument: InstrumentModel;
  changeInstrumentById: (id: string) => void;
  isSelected: boolean;
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
    filledPercent,
    value
  },
  onEdit,
  cancelOrder,
  instrument: {
    displayName,
    accuracy,
    baseAsset: {accuracy: baseAssetAccuracy, name: baseAssetName},
    quoteAsset: {accuracy: quoteAssetAccuracy, name: quoteAssetName},
    id: instrumentId
  },
  changeInstrumentById,
  isSelected
}) => {
  const handleEditOrder = () => onEdit(id);
  const handleCancelOrder = () => cancelOrder(id);
  const roundedValue =
    side === Side.Buy
      ? precisionCeil(value, quoteAssetAccuracy)
      : precisionFloor(value, quoteAssetAccuracy);
  const handleChangeInstrument = () =>
    !isSelected && changeInstrumentById(instrumentId);
  return (
    <tr>
      <Cell
        clickable={!isSelected}
        onClick={handleChangeInstrument}
        w={OrderCellWidth.Symbol}
      >
        {displayName}
      </Cell>
      <SideCell w={OrderCellWidth.Side} side={side}>
        {side}
      </SideCell>
      <TitledCell>{formattedNumber(price, accuracy)}</TitledCell>
      <TitledCell>
        {formattedNumber(volume, baseAssetAccuracy)} {baseAssetName}
      </TitledCell>
      <TitledCell>
        {toLocaleStringWithAccuracy(filled, baseAssetAccuracy)} ({toLocaleStringWithAccuracy(
          filledPercent,
          2,
          {style: 'percent'}
        )})
      </TitledCell>
      <TitledCell>
        {toLocaleStringWithAccuracy(roundedValue, quoteAssetAccuracy)}{' '}
        {quoteAssetName}
      </TitledCell>
      <TitledCell>{createdAt.toLocaleString()}</TitledCell>
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
