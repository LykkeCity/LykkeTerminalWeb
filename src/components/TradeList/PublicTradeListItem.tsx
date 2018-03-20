import * as React from 'react';
import {TradeModel} from '../../models/index';
import {formattedNumber, formattedTime} from '../../utils/localFormatted';
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
    <td>{formattedNumber(quantity)}</td>
    <td>{formattedNumber(price)}</td>
    <td>{side}</td>
    <td>
      <td>{formattedTime(timestamp)}</td>
    </td>
  </tr>
);

PublicTradeListItem.displayName = 'PublicTradeListItem';

const StyledPublicTradeListItem = styled(PublicTradeListItem)`
  ${p => colorFromSide(p)};
`;

export default StyledPublicTradeListItem;
