import * as React from 'react';
import {Side, TradeModel} from '../../models/index';
import styled, {colorFromSide} from '../styled';

interface TradeListItemProps extends TradeModel {
  className?: string;
}

const TradeListItem: React.SFC<TradeListItemProps> = ({
  side,
  asset,
  quantity,
  timestamp,
  tradeId,
  price,
  className
}) => (
  <tr className={className}>
    <td>{asset}</td>
    <td>{side === Side.Buy ? quantity : `-${quantity}`}</td>
    <td>{new Date(timestamp).toLocaleString()}</td>
  </tr>
);

const StyledTradeListItem = styled(TradeListItem)`
  ${p => colorFromSide(p)};
`;

export default StyledTradeListItem;
