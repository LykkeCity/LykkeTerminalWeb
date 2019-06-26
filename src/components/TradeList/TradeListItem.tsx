import * as React from 'react';
import {TradesCellWidth} from '.';
import {TradeModel} from '../../models/index';
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
  baseAssetName,
  quoteAssetName,
  changeInstrumentById,
  isSelected
}) => {
  const handleChangeInstrumentById = () =>
    !isSelected && instrument && changeInstrumentById(symbol);
  return (
    <tr>
      <Cell
        clickable={!isSelected}
        onClick={handleChangeInstrumentById}
        w={TradesCellWidth.Symbol}
        fontWeight="bold"
      >
        {instrument ? instrument!.displayName : symbol}
      </Cell>
      <MonoCell title={price}>
        <ColoredText side={side}>{price}</ColoredText>
      </MonoCell>
      <MonoCell>
        {volume} {baseAssetName}
      </MonoCell>
      <MonoCell>
        {oppositeVolume} {quoteAssetName}
      </MonoCell>
      <TitledCell fontWeight="bold">
        {new Date(timestamp).toLocaleString()}
      </TitledCell>
    </tr>
  );
};

export default TradeListItem;
