import {distanceInWordsToNow, format} from 'date-fns';
import * as React from 'react';
import {TradeModel} from '../../models/index';
import styled, {colorFromSide} from '../styled';

interface TradeListItemProps extends TradeModel {
  className?: string;
}

const TradeListItem: React.SFC<TradeListItemProps> = ({
  side,
  asset,
  quantity,
  timestamp,
  className
}) => (
  <tr className={className}>
    <td>{asset}</td>
    <td>{quantity}</td>
    <td title={format(new Date(timestamp))}>
      {distanceInWordsToNow(new Date(timestamp))} ago
    </td>
  </tr>
);

const StyledTradeListItem = styled(TradeListItem)`
  ${p => colorFromSide(p)};
`;

export default StyledTradeListItem;
