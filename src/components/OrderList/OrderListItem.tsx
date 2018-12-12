import * as React from 'react';
import {FiEdit2, FiX} from 'react-icons/fi';
import {AnalyticsEvents} from '../../constants/analyticsEvents';
import {InstrumentModel, OrderModel, Side} from '../../models';
import {AnalyticsService} from '../../services/analyticsService';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {precisionCeil, precisionFloor} from '../../utils/math';
import {Cell, ColoredText} from '../Table/styles';
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
  order: {createdAt, price, id, side, volume, filled, filledPercent, value},
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
  const handleEditOrder = () => {
    onEdit(id);
    AnalyticsService.track(AnalyticsEvents.StartOrderEdit);
  };
  const handleCancelOrder = () => {
    cancelOrder(id);
    AnalyticsService.track(AnalyticsEvents.CancelOrder);
  };
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
      <TitledCell title={formattedNumber(price, accuracy)}>
        <ColoredText side={side}>
          {formattedNumber(price, accuracy)}
        </ColoredText>
      </TitledCell>
      <TitledCell>
        {formattedNumber(volume, baseAssetAccuracy)} {baseAssetName}
      </TitledCell>
      <TitledCell>
        {formattedNumber(filled, baseAssetAccuracy)} ({formattedNumber(
          filledPercent,
          0,
          {style: 'percent'}
        )})
      </TitledCell>
      <TitledCell>
        {formattedNumber(roundedValue, quoteAssetAccuracy)} {quoteAssetName}
      </TitledCell>
      <TitledCell>{createdAt.toLocaleString()}</TitledCell>
      <Cell w={OrderCellWidth.Actions}>
        <span style={{cursor: 'pointer'}} onClick={handleEditOrder}>
          <FiEdit2 />
        </span>
        <span
          style={{cursor: 'pointer', marginLeft: '0.75rem'}}
          onClick={handleCancelOrder}
        >
          <FiX />
        </span>
      </Cell>
    </tr>
  );
};

export default OrderListItem;
