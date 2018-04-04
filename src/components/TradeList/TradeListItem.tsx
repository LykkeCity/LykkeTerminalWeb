import * as React from 'react';
import {TradeModel} from '../../models/index';
import {feeAssetFromSide} from '../../models/tradeModel.mapper';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {Cell} from '../Table/styles';
import {SideCell} from './styles';

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
        {formattedNumber(volume, baseAssetAccuracy)} {baseAssetName}
      </TitledCell>
      <TitledCell>{formattedNumber(price, accuracy)}</TitledCell>
      <TitledCell>
        {formattedNumber(oppositeVolume, quoteAssetAccuracy)} {quoteAssetName}
      </TitledCell>
      <Cell w={90}>{orderType}</Cell>
      <TitledCell>
        {formattedNumber(fee, feeAsset.accuracy)} {feeAsset.name}
      </TitledCell>
      <TitledCell>{new Date(timestamp).toLocaleString()}</TitledCell>
    </tr>
  );
};

export default TradeListItem;
