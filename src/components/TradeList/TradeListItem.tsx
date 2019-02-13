import * as React from 'react';
import {TradesCellWidth} from '.';
import {TradeModel} from '../../models/index';
import {feeAssetFromSide} from '../../models/tradeModel.mapper';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {Cell, ColoredText} from '../Table/styles';
import TitledCell from '../Table/TitledCell';

const MonoCell = (props: any) => (
  <TitledCell fontWeight="bold" fontFamily="Lekton, monospace" {...props} />
);

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
        fontWeight="bold"
      >
        {instrument!.displayName}
      </Cell>
      <MonoCell title={formattedNumber(price, accuracy)}>
        <ColoredText side={side}>
          {formattedNumber(price, accuracy)}
        </ColoredText>
      </MonoCell>
      <MonoCell>
        {formattedNumber(volume, baseAssetAccuracy)} {baseAssetName}
      </MonoCell>
      <MonoCell>
        {formattedNumber(fee, feeAsset.accuracy)} {feeAsset.name}
      </MonoCell>
      <MonoCell>
        {formattedNumber(oppositeVolume, quoteAssetAccuracy)} {quoteAssetName}
      </MonoCell>
      <TitledCell fontWeight="bold">
        {new Date(timestamp).toLocaleString()}
      </TitledCell>
    </tr>
  );
};

export default TradeListItem;
