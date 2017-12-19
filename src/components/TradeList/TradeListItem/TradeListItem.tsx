import * as React from 'react';
import TradeListSide from '../../../stores/enums/tradelistSide';
import TradeListItemInterface from './TradeListItemInterface';

const TradeListItem: React.SFC<TradeListItemInterface> = ({
  id,
  side,
  symbol,
  quantity,
  timestamp,
  price
}) => {
  const color = side === TradeListSide.Buy ? '#fb8f01' : '#d070ff';

  return (
    <tr key={id}>
      <td>{symbol}</td>
      <td style={{color}}>{side}</td>
      <td>{quantity}</td>
      <td>{price}</td>
      <td>{timestamp}</td>
    </tr>
  );
};

export default TradeListItem;
