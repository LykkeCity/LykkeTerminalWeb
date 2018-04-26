import * as React from 'react';
import {InstrumentModel, OrderModel} from '../../models';
import {toLocaleStringWithAccuracy} from '../../utils/string';
import {Icon} from '../Icon/index';
import {Cell} from '../Table/styles';
import {SideCell} from '../TradeList/styles';
import {OrderActions, OrderCellWidth} from './index';

const withTitle = (Component: React.ComponentType<any>) => ({
  children,
  ...rest
}: any) => (
  <Component title={React.Children.toArray(children).join('')} {...rest}>
    {children}
  </Component>
);

const TitledCell = withTitle(Cell);

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
  instrument: {
    displayName,
    accuracy,
    baseAsset: {accuracy: baseAssetAccuracy, name: baseAssetName},
    quoteAsset: {accuracy: quoteAssetAccuracy, name: quoteAssetName}
  }
}) => {
  const handleEditOrder = () => onEdit(id);
  const handleCancelOrder = () => cancelOrder(id);
  return (
    <tr>
      <Cell w={OrderCellWidth.Symbol}>{displayName}</Cell>
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
        {toLocaleStringWithAccuracy(price * volume, baseAssetAccuracy)}{' '}
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
