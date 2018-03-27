import * as React from 'react';
import {TradeModel} from '../../models/index';
import {feeAssetFromSide} from '../../models/tradeModel.mapper';
import {TradeRow} from './styles';

const toLocaleStringWithAccuracy = (num: number, accuracy: number) =>
  num.toLocaleString(undefined, {
    maximumFractionDigits: accuracy
  });

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
    <TradeRow className={className} side={side}>
      <td>{symbol}</td>
      <td>{side}</td>
      <td>
        {toLocaleStringWithAccuracy(volume, baseAssetAccuracy)} {baseAssetName}
      </td>
      <td>{toLocaleStringWithAccuracy(price, accuracy)}</td>
      <td>
        {toLocaleStringWithAccuracy(oppositeVolume, quoteAssetAccuracy)}{' '}
        {quoteAssetName}
      </td>
      <td>{orderType}</td>
      <td>
        {toLocaleStringWithAccuracy(fee, feeAsset.accuracy)} {feeAsset.name}
      </td>
      <td>{new Date(timestamp).toLocaleString()}</td>
    </TradeRow>
  );
};

export default TradeListItem;
