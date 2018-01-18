import * as React from 'react';
import {OrderListItemProps} from '../';
import {Side} from '../../../models';
import {Icon} from '../../Icon/index';
import {Cell} from '../../Table/index';

const cellNumber = 9;
const DataCell = Cell(cellNumber);

const OrderListItem: React.SFC<OrderListItemProps> = ({
  createdDate,
  currentPrice,
  expiryDate,
  orderId,
  side,
  symbol,
  volume
}) => {
  const colorSide = side === Side.Buy ? '#fb8f01' : '#d070ff';

  return (
    <div className="tr" key={orderId}>
      <DataCell className="td">{symbol}</DataCell>
      <DataCell className="td">
        <Icon name="cross" />
      </DataCell>
      <DataCell className="td">{orderId}</DataCell>
      <DataCell className="td" style={{color: colorSide}}>
        {side}
      </DataCell>
      <DataCell className="td">{volume}</DataCell>
      <DataCell className="td">{currentPrice.toFixed(3)}</DataCell>
      <DataCell className="td">{createdDate}</DataCell>
      <DataCell className="td">{expiryDate}</DataCell>
      <DataCell className="td">
        <Icon name="pencil" />
      </DataCell>
    </div>
  );
};

export default OrderListItem;
