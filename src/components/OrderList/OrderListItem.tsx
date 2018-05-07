import * as React from 'react';
import {InstrumentModel, OrderModel, Side} from '../../models';
import {precisionCeil, precisionFloor} from '../../utils/math';
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
  clickable: boolean;
  changeInstrumentById: (id: string) => void;
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
  clickable,
  changeInstrumentById
}) => {
  const handleEditOrder = () => onEdit(id);
  const handleCancelOrder = () => cancelOrder(id);
  const roundedValue =
    side === Side.Buy
      ? precisionCeil(value, quoteAssetAccuracy)
      : precisionFloor(value, quoteAssetAccuracy);
  const handleChangeInstrument = () =>
    clickable && changeInstrumentById(instrumentId);
  return (
    <tr>
      <Cell
        clickable={clickable}
        onClick={handleChangeInstrument}
        w={OrderCellWidth.Symbol}
      >
        {displayName}
      </Cell>
      <SideCell w={OrderCellWidth.Side} side={side}>
        {side}
      </SideCell>
      <TitledCell>{toLocaleStringWithAccuracy(price, accuracy)}</TitledCell>
      <TitledCell>
        {toLocaleStringWithAccuracy(volume, baseAssetAccuracy)} {baseAssetName}
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
