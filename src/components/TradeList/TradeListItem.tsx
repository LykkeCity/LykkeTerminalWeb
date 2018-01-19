import * as React from 'react';
import {TradeModel} from '../../models/index';
import styled, {colorFromSide} from '../styled';
import {Cell} from '../Table/index';

interface TradeListItemProps extends TradeModel {
  className?: string;
}

const cellNumber = 4;
const DataCell = Cell(cellNumber);

const TradeListItem: React.SFC<TradeListItemProps> = ({
  side,
  symbol,
  quantity,
  timestamp,
  tradeId,
  price,
  className
}) => (
  <div className={`tr ${className}`}>
    <DataCell className="td">{symbol}</DataCell>
    <DataCell className="td">{quantity}</DataCell>
    <DataCell className="td">{price}</DataCell>
    <DataCell className="td">{new Date(timestamp).toLocaleString()}</DataCell>
  </div>
);

const StyledTradeListItem = styled(TradeListItem)`
  ${p => colorFromSide(p)};
`;

export default StyledTradeListItem;
