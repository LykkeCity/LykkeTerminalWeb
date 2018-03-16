import * as React from 'react';
import {FormattedTime} from 'react-intl';
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
    <td>
      <td>
        <FormattedTime
          value={timestamp}
          hour="numeric"
          minute="numeric"
          second="numeric"
        />
      </td>
    </td>
  </tr>
);

PublicTradeListItem.displayName = 'PublicTradeListItem';

const StyledPublicTradeListItem = styled(PublicTradeListItem)`
  ${p => colorFromSide(p)};
`;

export default StyledPublicTradeListItem;
