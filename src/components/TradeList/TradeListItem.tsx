import * as React from 'react';
import {TradeModel} from '../../models/index';
import {formattedDateTime, formattedNumber} from '../../utils/localFormatted';
import styled, {colorFromSide} from '../styled';

interface TradeListItemProps extends TradeModel {
  className?: string;
}

const TradeListItem: React.SFC<TradeListItemProps> = ({
  price,
  side,
  symbol,
  quantity,
  oppositeQuantity,
  orderType,
  fee,
  timestamp,
  className
}) => (
  <tr className={className}>
    <td>{symbol}</td>
    <td>{side}</td>
    <td>{formattedNumber(quantity)}</td>
    <td>{formattedNumber(price)}</td>
    <td>{formattedNumber(oppositeQuantity)}</td>
    <td>{orderType}</td>
    <td>{fee}</td>
    <td>{formattedDateTime(new Date(timestamp))}</td>
  </tr>
);

const StyledTradeListItem = styled(TradeListItem)`
  ${p => colorFromSide(p)};
`;

export default StyledTradeListItem;
