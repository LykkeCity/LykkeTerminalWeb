import {isToday} from 'date-fns';
import * as React from 'react';
import {TradeModel} from '../../models/index';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import ColoredTitledCell from '../Table/ColoredTitledCell';
import TitledCell from '../Table/TitledCell';

// tslint:disable-next-line:no-empty-interface
export interface PublicTradeListItemProps extends TradeModel {}

export const PublicTradeListItem: React.SFC<PublicTradeListItemProps> = ({
  volume,
  price,
  side,
  instrument,
  timestamp
}) => {
  const date = new Date(timestamp);
  return (
    <tr>
      <ColoredTitledCell side={side}>
        {formattedNumber(price, instrument!.accuracy)}
      </ColoredTitledCell>
      <TitledCell>
        {formattedNumber(volume, instrument!.baseAsset.accuracy)}
      </TitledCell>
      <TitledCell title={date.toLocaleString()}>
        {isToday(date) ? date.toLocaleTimeString() : date.toLocaleString()}
      </TitledCell>
    </tr>
  );
};

export default PublicTradeListItem;
