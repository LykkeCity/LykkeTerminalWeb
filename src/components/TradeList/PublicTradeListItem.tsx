import {isToday} from 'date-fns';
import * as React from 'react';
import {TradeModel} from '../../models/index';
import {SideCell} from './styles';
import {toLocaleStringWithAccuracy} from './TradeListItem';

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
      <td>
        {toLocaleStringWithAccuracy(volume, instrument!.baseAsset.accuracy)}
      </td>
      <td>{toLocaleStringWithAccuracy(price, instrument!.accuracy)}</td>
      <SideCell w={50} side={side}>
        {side}
      </SideCell>
      <td title={date.toLocaleString()}>
        {isToday(date) ? date.toLocaleTimeString() : date.toLocaleString()}
      </td>
    </tr>
  );
};

export default PublicTradeListItem;
