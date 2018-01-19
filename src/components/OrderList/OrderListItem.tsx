import * as React from 'react';
import {OrderModel, Side} from '../../models';
import {Icon} from '../Icon/index';
import {Cell} from '../Table/index';
import {OrderActions} from './index';

interface OrderListItemProps extends OrderModel, OrderActions {}

const cellNumber = 7;
const DataCell = Cell(cellNumber);

const OrderListItem: React.SFC<OrderListItemProps> = ({
  createdAt,
  price,
  expiredAt,
  id,
  side,
  symbol,
  volume
}) => {
  const colorSide = side === Side.Buy ? '#fb8f01' : '#d070ff';
  return (
    <div className="tr">
      <DataCell className="td">{symbol}</DataCell>
      <DataCell className="td">
        <Icon name="cross" />
      </DataCell>
      <DataCell className="td">{id}</DataCell>
      <DataCell className="td" style={{color: colorSide}}>
        {side}
      </DataCell>
      <DataCell className="td">{volume}</DataCell>
      <DataCell className="td">{price}</DataCell>
      <DataCell className="td">{createdAt.toLocaleString()}</DataCell>
    </div>
  );
};

export default OrderListItem;
