import * as React from 'react';
import {TradeListItemProps} from '../';
import Side from '../../../stores/side';

const TradeListItem: React.SFC<TradeListItemProps> = ({
  id,
  side,
  symbol,
  quantity,
  timestamp,
  price
}) => {
  const color = side === Side.Buy ? '#fb8f01' : '#d070ff';

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
