import * as React from 'react';
import {InstrumentModel, OrderModel, Side} from '../../models';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {precisionCeil, precisionFloor} from '../../utils/math';
import {Icon} from '../Icon/index';
import {Cell, ColoredText} from '../Table/styles';
import TitledCell from '../Table/TitledCell';
import {OrderActions, OrderCellWidth} from './index';

import MediaQuery from 'react-responsive';

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
      <TitledCell title={formattedNumber(price, accuracy)}>
        <ColoredText side={side}>
          {formattedNumber(price, accuracy)}
        </ColoredText>
      </TitledCell>
      <TitledCell>
        {formattedNumber(volume, baseAssetAccuracy)} {baseAssetName}
      </TitledCell>
      <MediaQuery query="(min-device-width: 1224px)">
        <TitledCell>
          {formattedNumber(filled, baseAssetAccuracy)} ({formattedNumber(
            filledPercent,
            2,
            {style: 'percent'}
          )})
        </TitledCell>
        <TitledCell>
          {formattedNumber(roundedValue, quoteAssetAccuracy)} {quoteAssetName}
        </TitledCell>
      </MediaQuery>
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
