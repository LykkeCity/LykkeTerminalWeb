import * as React from 'react';
import {TradeModel} from '../../models/index';
import styled, {colorFromSide} from '../styled';

interface TradeListItemProps extends TradeModel {
  className?: string;
}

const TradeListItem: React.SFC<TradeListItemProps> = ({
  side,
  symbol,
  quantity,
  timestamp,
  tradeId,
  price,
  className
}) => (
  <tr className={className}>
    <td>{symbol}</td>
    <td>{quantity}</td>
    <td>{price}</td>
    <td>{new Date(timestamp).toLocaleString()}</td>
  </tr>
);

const StyledTradeListItem = styled(TradeListItem)`
  ${p => colorFromSide(p)};
`;

export default StyledTradeListItem;
