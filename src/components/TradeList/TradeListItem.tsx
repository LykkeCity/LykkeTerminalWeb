import * as React from 'react';
import {TradeModel} from '../../models/index';
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
    <td>{quantity}</td>
    <td>{price}</td>
    <td>{oppositeQuantity}</td>
    <td>{orderType}</td>
    <td>{fee}</td>
    <td>{new Date(timestamp).toLocaleString()}</td>
  </tr>
);

const StyledTradeListItem = styled(TradeListItem)`
  ${p => colorFromSide(p)};
`;

export default StyledTradeListItem;
