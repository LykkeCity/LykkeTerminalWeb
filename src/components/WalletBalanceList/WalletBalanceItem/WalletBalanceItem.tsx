import * as React from 'react';
import {WalletBalanceItemProps} from '../';
import {Cell} from '../../Table/index';
import WalletBalanceNumber from './WalletBalanceNumber';

const cellNumber = 2;
const DataCell = Cell(cellNumber);

const WalletBalanceItem: React.SFC<WalletBalanceItemProps> = ({
  accuracy,
  balance,
  id
}) => (
  <div className="tr" key={id}>
    <DataCell className="td">{id}</DataCell>
    <DataCell className="td">
      <WalletBalanceNumber num={balance.toFixed(accuracy)} />
    </DataCell>
  </div>
);

export default WalletBalanceItem;
