import * as React from 'react';
import {AssetBalanceModel, AssetModel} from '../../../models';
import {colors} from '../../styled';
import {Cell} from '../../Table/styles';
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
    <Cell w="20%">{assetBalance.name}</Cell>
    <Cell w="40%">
      <WalletBalanceNumber
        num={assetBalance.balanceInBaseAsset}
        accuracy={baseAsset.accuracy}
        color={colors.lightGrey}
      >
        &nbsp;{baseAsset.name}
      </WalletBalanceNumber>
    </Cell>
    <Cell w="40%">
      <WalletBalanceNumber
        num={assetBalance.balance}
        accuracy={assetBalance.accuracy}
      >
        &nbsp;{assetBalance.name}
      </WalletBalanceNumber>
    </Cell>
  </tr>
);
export default WalletBalanceItem;
