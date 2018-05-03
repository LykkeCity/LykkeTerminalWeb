import {isToday} from 'date-fns';
import * as React from 'react';
import {PublicTradesCellWidth} from '.';
import {TradeModel} from '../../models/index';
import {toLocaleStringWithAccuracy} from '../../utils/string';
import {SideCell} from './styles';

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
      <td>{toLocaleStringWithAccuracy(price, instrument!.accuracy)}</td>
      <td>
        {toLocaleStringWithAccuracy(volume, instrument!.baseAsset.accuracy)}
      </td>
      <SideCell w={PublicTradesCellWidth.Side} side={side}>
        {side}
      </SideCell>
      <td title={date.toLocaleString()}>
        {isToday(date) ? date.toLocaleTimeString() : date.toLocaleString()}
      </td>
    </tr>
  );
};

export default PublicTradeListItem;
