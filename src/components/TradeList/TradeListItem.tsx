import * as React from 'react';
import {TradeModel} from '../../models/index';
import {feeAssetFromSide} from '../../models/tradeModel.mapper';
import {Cell} from '../Table/styles';
import {SideCell} from './styles';

export const toLocaleStringWithAccuracy = (num: number, accuracy: number) =>
  num.toLocaleString(undefined, {
    maximumFractionDigits: accuracy
  });

const withTitle = (Component: React.ComponentType<any>) => ({
  children,
  ...rest
}: any) => (
  <Component title={React.Children.toArray(children).join('')} {...rest}>
    {children}
  </Component>
);

const TitledCell = withTitle(Cell);

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
      <Cell w={70}>{instrument!.displayName}</Cell>
      <SideCell w={50} side={side}>
        {side}
      </SideCell>
      <TitledCell>
        {toLocaleStringWithAccuracy(volume, baseAssetAccuracy)} {baseAssetName}
      </TitledCell>
      <TitledCell>{toLocaleStringWithAccuracy(price, accuracy)}</TitledCell>
      <TitledCell>
        {toLocaleStringWithAccuracy(oppositeVolume, quoteAssetAccuracy)}{' '}
        {quoteAssetName}
      </TitledCell>
      <Cell w={90}>{orderType}</Cell>
      <TitledCell>
        {toLocaleStringWithAccuracy(fee, feeAsset.accuracy)} {feeAsset.name}
      </TitledCell>
      <TitledCell>{new Date(timestamp).toLocaleString()}</TitledCell>
    </tr>
  );
};

export default TradeListItem;
