import * as React from 'react';
import {
  WalletItem,
  WalletItemContainer,
  WalletItemSelected,
  WalletName,
  WalletTotalBalance
} from './styles';

interface WalletNameProps {
  name: string;
  selectedIndex: boolean;
  baseAssetName: string;
  totalBalance?: number;
  accuracy: number;
}

const Name: React.SFC<WalletNameProps> = ({
  name,
  selectedIndex,
  baseAssetName,
  totalBalance,
  accuracy
}) => {
  const totalBalanceWithLocale =
    totalBalance &&
    totalBalance.toLocaleString(undefined, {
      maximumFractionDigits: accuracy
    }) +
      ' ' +
      baseAssetName;
  const content = (
    <WalletItemContainer>
      <WalletName title={name}>{name}</WalletName>
      <WalletTotalBalance title={totalBalanceWithLocale + ''}>
        {totalBalanceWithLocale}
      </WalletTotalBalance>
    </WalletItemContainer>
  );
  if (selectedIndex) {
    return <WalletItemSelected>{content}</WalletItemSelected>;
  } else {
    return <WalletItem>{content}</WalletItem>;
  }
};

export default Name;
