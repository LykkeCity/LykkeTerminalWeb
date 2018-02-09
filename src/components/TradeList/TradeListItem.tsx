import * as React from 'react';
import {Side, TradeModel} from '../../models/index';
import styled, {colorFromSide} from '../styled';

interface TradeListItemProps extends TradeModel {
  className?: string;
}

const TradeListItem: React.SFC<TradeListItemProps> = ({
  price,
  side,
  symbol,
  buyVolume,
  sellVolume,
  timestamp,
  className
}) => {
  const {[0]: baseAsset, [1]: quoteAsset} = symbol.split('/');
  return (
    <tr className={className}>
      <td>{symbol}</td>
      <td>{side}</td>
      <td>
        {buyVolume}&nbsp;{side === Side.Buy ? baseAsset : quoteAsset}
      </td>
      <td>
        {sellVolume}&nbsp;
        {side === Side.Sell ? baseAsset : quoteAsset}
      </td>
      <td>{price}</td>
      <td>{new Date(timestamp).toLocaleString()}</td>
    </tr>
  );
};

const StyledTradeListItem = styled(TradeListItem)`
  ${p => colorFromSide(p)};
`;

export default StyledTradeListItem;
