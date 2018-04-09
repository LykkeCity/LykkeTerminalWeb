import {observer} from 'mobx-react';
import * as React from 'react';
import {WalletBalanceItemProps} from '../';
import {Cell} from '../../Table/styles';
import WalletBalanceNumber from './WalletBalanceNumber';

const WalletBalanceItem: React.SFC<WalletBalanceItemProps> = ({
  assetBalance: {
    id,
    name,
    accuracy,
    balance,
    reserved,
    available,
    balanceInBaseAsset
  },
  baseAsset
}) => (
  <tr key={id}>
    <Cell w={60}>{name}</Cell>
    <td>
      <WalletBalanceNumber
        num={balanceInBaseAsset}
        accuracy={baseAsset.accuracy}
        color={'rgba(245, 246, 247, 0.4)'}
      >
        &nbsp;{baseAsset.name}
      </WalletBalanceNumber>
    </td>
    <td>
      <WalletBalanceNumber num={balance} accuracy={accuracy}>
        &nbsp;{name}
      </WalletBalanceNumber>
    </td>
  </tr>
);

export default observer(WalletBalanceItem);
