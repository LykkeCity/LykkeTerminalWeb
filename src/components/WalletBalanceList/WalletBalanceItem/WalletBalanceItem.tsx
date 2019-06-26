import * as React from 'react';
import {AssetBalanceModel} from '../../../models';
import {Cell} from '../../Table/styles';
import WalletBalanceNumber from './WalletBalanceNumber';

interface WalletBalanceItemProps {
  assetBalance: AssetBalanceModel;
  onClick?: () => void;
  onClickRow?: () => void;
}
const WalletBalanceItem: React.SFC<WalletBalanceItemProps> = ({
  assetBalance,
  onClick,
  onClickRow
}) => (
  <tr onClick={onClickRow}>
    <Cell w="30%" fontWeight="bold" clickable={true}>
      {assetBalance.name}
    </Cell>
    <Cell w="70%" clickable={true}>
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
