import * as React from 'react';
import {TradesCellWidth} from '.';
import {TradeModel} from '../../models/index';
import {feeAssetFromSide} from '../../models/tradeModel.mapper';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {Cell, ColoredText} from '../Table/styles';
import TitledCell from '../Table/TitledCell';

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
      <TitledCell
        title={formattedNumber(price, accuracy)}
        fontFamily="Lekton, monospace"
      >
        <ColoredText side={side}>
          {formattedNumber(price, accuracy)}
        </ColoredText>
      </TitledCell>
      <TitledCell fontFamily="Lekton, monospace">
        {formattedNumber(volume, baseAssetAccuracy)} {baseAssetName}
      </TitledCell>
      <TitledCell fontFamily="Lekton, monospace">
        {formattedNumber(fee, feeAsset.accuracy)} {feeAsset.name}
      </TitledCell>
      <TitledCell fontFamily="Lekton, monospace">
        {formattedNumber(oppositeVolume, quoteAssetAccuracy)} {quoteAssetName}
      </TitledCell>
      <TitledCell>{new Date(timestamp).toLocaleString()}</TitledCell>
    </tr>
  );
};

export default TradeListItem;
