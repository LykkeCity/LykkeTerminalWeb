import * as React from 'react';
import {InstrumentModel, OrderModel, Side} from '../../models';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {precisionCeil, precisionFloor} from '../../utils/math';
import {Icon} from '../Icon/index';
import ColoredTitledCell from '../Table/ColoredTitledCell';
import {Cell} from '../Table/styles';
import TitledCell from '../Table/TitledCell';
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
      <ColoredTitledCell side={side}>
        {formattedNumber(price, accuracy)}
      </ColoredTitledCell>
      <TitledCell side={side}>
        {formattedNumber(volume, baseAssetAccuracy)} {baseAssetName}
      </TitledCell>
      <TitledCell side={side}>
        {formattedNumber(filled, baseAssetAccuracy)} ({formattedNumber(
          filledPercent,
          2,
          {style: 'percent'}
        )})
      </TitledCell>
      <TitledCell side={side}>
        {formattedNumber(roundedValue, quoteAssetAccuracy)} {quoteAssetName}
      </TitledCell>
      <TitledCell>{createdAt.toLocaleString()}</TitledCell>
      <Cell w={OrderCellWidth.Actions}>
        <span onClick={handleEditOrder}>
          <Icon name={'edit-alt'} />
        </span>
        <span style={{marginLeft: '0.75rem'}} onClick={handleCancelOrder}>
          <Icon name={'close'} />
        </span>
      </Cell>
    </tr>
  );
};

export default OrderListItem;
