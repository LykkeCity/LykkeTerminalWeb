import {observer} from 'mobx-react';
import * as React from 'react';
import {AssetModel} from '../../../models';
import WalletBalanceNumber from './WalletBalanceNumber';

interface WalletBalanceItemProps {
  balance: any;
  baseAsset: AssetModel;
  asset: AssetModel;
}
const WalletBalanceItem: React.SFC<WalletBalanceItemProps> = ({
  balance,
  baseAsset,
  asset
}) => {
  return (
    <tr>
      <td>{balance ? balance.AssetId : baseAsset.name}</td>
      <td />
      <td>
        <WalletBalanceNumber
          num={balance ? balance.Balance : 0}
          accuracy={baseAsset.accuracy}
          color={'rgba(245, 246, 247, 0.4)'}
        >
          &nbsp;{baseAsset.name}
        </WalletBalanceNumber>
      </td>
      <td>
        <WalletBalanceNumber
          num={balance ? balance.Balance : 0}
          accuracy={asset.accuracy}
        >
          &nbsp;{name}
        </WalletBalanceNumber>
      </td>
    </tr>
  );
};

export default observer(WalletBalanceItem);
