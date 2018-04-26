import * as React from 'react';
import {TradesCellWidth} from '.';
import {TradeModel} from '../../models/index';
import {feeAssetFromSide} from '../../models/tradeModel.mapper';
import {toLocaleStringWithAccuracy} from '../../utils/string';
import {Cell} from '../Table/styles';
import {TitledCell} from '../Table/TitledCell';
import {SideCell} from './styles';

interface TradeListItemProps extends TradeModel {
  className?: string;
}

const TradeListItem: React.SFC<TradeListItemProps> = ({
  price,
  side,
  symbol,
  volume,
  oppositeVolume,
  orderType,
  fee,
  timestamp,
  instrument,
  className
}) => {
  const {
    accuracy,
    baseAsset: {accuracy: baseAssetAccuracy, name: baseAssetName},
    quoteAsset: {accuracy: quoteAssetAccuracy, name: quoteAssetName}
  } = instrument!;
  const feeAsset = feeAssetFromSide(instrument!, side);
  return (
    <tr>
      <Cell w={TradesCellWidth.Symbol}>{instrument!.displayName}</Cell>
      <SideCell w={TradesCellWidth.Side} side={side}>
        {side}
      </SideCell>
      <TitledCell>{toLocaleStringWithAccuracy(price, accuracy)}</TitledCell>
      <TitledCell>
        {toLocaleStringWithAccuracy(volume, baseAssetAccuracy)} {baseAssetName}
      </TitledCell>
      <TitledCell>
        {toLocaleStringWithAccuracy(fee, feeAsset.accuracy)} {feeAsset.name}
      </TitledCell>
      <TitledCell>
        {toLocaleStringWithAccuracy(oppositeVolume, quoteAssetAccuracy)}{' '}
        {quoteAssetName}
      </TitledCell>
      <Cell w={TradesCellWidth.OrderType}>{orderType}</Cell>
      <TitledCell>{new Date(timestamp).toLocaleString()}</TitledCell>
    </tr>
  );
};

export default TradeListItem;
