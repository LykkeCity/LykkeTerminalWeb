import * as React from 'react';
import {TradeModel} from '../../models/index';
import {feeAssetFromSide} from '../../models/tradeModel.mapper';
import {TradeRow} from './styles';

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
  className,
  instrument
}) => (
  <TradeRow className={className} side={side}>
    <td>{symbol}</td>
    <td>{side}</td>
    <td>
      {volume} {instrument!.baseAsset.name}
    </td>
    <td>{price}</td>
    <td>
      {oppositeVolume} {instrument!.quoteAsset.name}
    </td>
    <td>{orderType}</td>
    <td>
      {fee} {feeAssetFromSide(instrument!, side).name}
    </td>
    <td>{new Date(timestamp).toLocaleString()}</td>
  </TradeRow>
);

export default TradeListItem;
