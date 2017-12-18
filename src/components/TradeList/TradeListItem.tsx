import * as React from 'react';
import TradeListSide from '../../stores/enums/tradelistSide';

interface TradeListItemProps {
  id: number;
  quantity: number;
  side: TradeListSide;
  symbol: string;
  price: string;
  timestamp: Date;
}

const TradelistItem: React.SFC<TradeListItemProps> = ({
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

export default TradelistItem;
