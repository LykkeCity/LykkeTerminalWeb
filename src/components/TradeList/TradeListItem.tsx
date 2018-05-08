import * as React from 'react';
import {TradesCellWidth} from '.';
import {TradeModel} from '../../models/index';
import {feeAssetFromSide} from '../../models/tradeModel.mapper';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {Cell} from '../Table/styles';
import TitledCell from '../Table/TitledCell';
import {SideCell} from './styles';

interface TradeListItemProps extends TradeModel {
  className?: string;
  changeInstrumentById: (id: string) => void;
  isSelected: boolean;
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
  className,
  changeInstrumentById,
  isSelected
}) => {
  const {
    accuracy,
    baseAsset: {accuracy: baseAssetAccuracy, name: baseAssetName},
    quoteAsset: {accuracy: quoteAssetAccuracy, name: quoteAssetName},
    id: instrumentId
  } = instrument!;
  const feeAsset = feeAssetFromSide(instrument!, side);
  const handleChangeInstrumentById = () =>
    !isSelected && changeInstrumentById(instrumentId);
  return (
    <tr>
      <Cell
        clickable={!isSelected}
        onClick={handleChangeInstrumentById}
        w={TradesCellWidth.Symbol}
      >
        {instrument!.displayName}
      </Cell>
      <SideCell w={TradesCellWidth.Side} side={side}>
        {side}
      </SideCell>
      <TitledCell>{formattedNumber(price, accuracy)}</TitledCell>
      <TitledCell>
        {formattedNumber(volume, baseAssetAccuracy)} {baseAssetName}
      </TitledCell>
      <TitledCell>
        {formattedNumber(fee, feeAsset.accuracy)} {feeAsset.name}
      </TitledCell>
      <TitledCell>
        {formattedNumber(oppositeVolume, quoteAssetAccuracy)} {quoteAssetName}
      </TitledCell>
      <Cell w={TradesCellWidth.OrderType}>{orderType}</Cell>
      <TitledCell>{new Date(timestamp).toLocaleString()}</TitledCell>
    </tr>
  );
};

export default TradeListItem;
