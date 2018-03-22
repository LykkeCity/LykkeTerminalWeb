import * as React from 'react';
import {TradeModel} from '../../models/index';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import styled, {colorFromSide} from '../styled';

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
    <td>{formattedNumber(quantity)}</td>
    <td>{formattedNumber(price)}</td>
    <td>{side}</td>
    <td>{new Date(timestamp).toLocaleTimeString()}</td>
  </tr>
);

PublicTradeListItem.displayName = 'PublicTradeListItem';

const StyledPublicTradeListItem = styled(PublicTradeListItem)`
  ${p => colorFromSide(p)};
`;

export default StyledPublicTradeListItem;
