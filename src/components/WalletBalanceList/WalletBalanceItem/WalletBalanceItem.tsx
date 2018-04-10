import * as React from 'react';
import {AssetModel} from '../../../models';
import WalletBalanceNumber from './WalletBalanceNumber';
interface WalletBalanceItemProps {
  balance: any;
  baseAsset: AssetModel;
  asset: AssetModel;
}
const WalletBalanceItem: React.SFC<WalletBalanceItemProps> = ({
  balance: {balance, balanceInBaseAsset},
  baseAsset,
  asset
}) =>
  (asset && (
    <tr>
      <td>{asset.name}</td>
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
        <WalletBalanceNumber num={balance} accuracy={asset.accuracy}>
          &nbsp;{asset.name}
        </WalletBalanceNumber>
      </td>
    </tr>
  )) ||
  null;
export default WalletBalanceItem;
