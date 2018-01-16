import * as React from 'react';
import {TradeListItemProps} from '../';
import {Side} from '../../../models';

const TradeListItem: React.SFC<TradeListItemProps> = ({
  side,
  symbol,
  quantity,
  timestamp,
  tradeId,
  price
}) => {
  const color = side === Side.Buy ? '#fb8f01' : '#d070ff';

  return (
    <tr key={tradeId}>
      <td>{symbol}</td>
      <td style={{color}}>{side}</td>
      <td>{quantity}</td>
      <td>{price}</td>
      <td>{timestamp}</td>
    </tr>
  );
};

export default TradeListItem;
