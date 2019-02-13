import * as React from 'react';
import {AssetBalanceModel} from '../../../models';
import {Cell} from '../../Table/styles';
import WalletBalanceNumber from './WalletBalanceNumber';

interface WalletBalanceItemProps {
  assetBalance: AssetBalanceModel;
  onClick?: () => void;
}
const WalletBalanceItem: React.SFC<WalletBalanceItemProps> = ({
  assetBalance,
  onClick
}) => (
  <tr>
    <Cell w="30%" fontWeight="bold">
      {assetBalance.name}
    </Cell>
    <Cell w="70%">
      <WalletBalanceNumber
        availableBalance={assetBalance.available}
        totalBalance={assetBalance.balance}
        accuracy={assetBalance.accuracy}
        onClick={onClick}
      >
        &nbsp;{assetBalance.name}
      </WalletBalanceNumber>
    </Cell>
  </tr>
);
export default WalletBalanceItem;
