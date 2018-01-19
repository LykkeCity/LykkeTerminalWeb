import * as React from 'react';
import {BalanceListItemProps} from '../';
import {Cell} from '../../Table/index';
import BalanceNumber from './BalanceNumber';

const cellNumber = 2;
const DataCell = Cell(cellNumber);

const BalanceListItem: React.SFC<BalanceListItemProps> = ({
  accuracy,
  balance,
  id,
  profitAndLoss,
  symbol
}) => (
  <div className="tr" key={id}>
    <DataCell className="td">{symbol}</DataCell>
    <DataCell className="td">
      <BalanceNumber num={balance.toFixed(accuracy)} />
    </DataCell>
  </div>
);

export default BalanceListItem;
