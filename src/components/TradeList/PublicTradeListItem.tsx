import {format} from 'date-fns';
import * as React from 'react';
import {TradeModel} from '../../models/index';
import styled, {colorFromSide} from '../styled';

// tslint:disable-next-line:no-empty-interface
export interface PublicTradeListItemProps extends TradeModel {
  className?: string;
}

export const PublicTradeListItem: React.SFC<PublicTradeListItemProps> = ({
  quantity,
  price,
  side,
  timestamp,
  className
}) => (
  <tr className={className}>
    <td>{quantity}</td>
    <td>{price}</td>
    <td>{side}</td>
    <td>{format(timestamp, 'HH:mm:ss')}</td>
  </tr>
);

PublicTradeListItem.displayName = 'PublicTradeListItem';

const StyledPublicTradeListItem = styled(PublicTradeListItem)`
  ${p => colorFromSide(p)};
`;

export default StyledPublicTradeListItem;
