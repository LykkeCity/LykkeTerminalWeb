import * as React from 'react';
import {TradeModel} from '../../models/index';
import {SideCell} from './styles';

// tslint:disable-next-line:no-empty-interface
export interface PublicTradeListItemProps extends TradeModel {}

export const PublicTradeListItem: React.SFC<PublicTradeListItemProps> = ({
  volume,
  price,
  side,
  timestamp
}) => (
  <tr>
    <td>{volume}</td>
    <td>{price}</td>
    <SideCell>{side}</SideCell>
    <td>{new Date(timestamp).toLocaleTimeString()}</td>
  </tr>
);

export default PublicTradeListItem;
