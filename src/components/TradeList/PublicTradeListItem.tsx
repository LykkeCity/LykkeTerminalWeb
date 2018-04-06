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
}) => (
  <tr>
    <td>
      {toLocaleStringWithAccuracy(volume, instrument!.baseAsset.accuracy)}
    </td>
    <td>{toLocaleStringWithAccuracy(price, instrument!.accuracy)}</td>
    <SideCell w={PublicTradesCellWidth.Side} side={side}>
      {side}
    </SideCell>
    <td>{new Date(timestamp).toLocaleTimeString()}</td>
  </tr>
);

export default PublicTradeListItem;
