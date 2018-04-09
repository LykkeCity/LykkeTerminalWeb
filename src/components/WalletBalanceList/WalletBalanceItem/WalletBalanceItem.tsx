import * as React from 'react';
import {AssetModel} from '../../../models';
import WalletBalanceNumber from './WalletBalanceNumber';
interface WalletBalanceItemProps {
  balance: any;
  baseAsset: AssetModel;
  asset: AssetModel;
}
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
