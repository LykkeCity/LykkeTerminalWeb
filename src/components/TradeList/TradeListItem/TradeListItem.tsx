import * as React from 'react';
import {TradeListItemProps} from '../';
import {Side} from '../../../models';
import {Cell} from '../../Table/index';

const cellNumber = 5;
const DataCell = Cell(cellNumber);

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
    <div className="tr" key={tradeId}>
      <DataCell className="td">{symbol}</DataCell>
      <DataCell className="td" style={{color}}>
        {side}
      </DataCell>
      <DataCell className="td">{quantity}</DataCell>
      <DataCell className="td">{price}</DataCell>
      <DataCell className="td">{timestamp}</DataCell>
    </div>
  );
};

export default TradeListItem;
