import * as React from 'react';
import {AssetBalanceModel, AssetModel} from '../../../models';
import {colors} from '../../styled';
import WalletBalanceNumber from './WalletBalanceNumber';

interface WalletBalanceItemProps {
  assetBalance: AssetBalanceModel;
  baseAsset: AssetModel;
}
const WalletBalanceItem: React.SFC<WalletBalanceItemProps> = ({
  assetBalance,
  baseAsset
}) => (
  <tr>
    <td>{assetBalance.name}</td>
    <td>
      <WalletBalanceNumber
        num={assetBalance.balanceInBaseAsset}
        accuracy={baseAsset.accuracy}
        color={colors.lightGrey}
      >
        &nbsp;{baseAsset.name}
      </WalletBalanceNumber>
    </td>
    <td>
      <WalletBalanceNumber
        num={assetBalance.balance}
        accuracy={assetBalance.accuracy}
      >
        &nbsp;{assetBalance.name}
      </WalletBalanceNumber>
    </td>
  </tr>
);
export default WalletBalanceItem;
