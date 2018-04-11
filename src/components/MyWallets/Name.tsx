import * as React from 'react';
import {WalletItemContainer, WalletName, WalletTotalBalance} from './styles';

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

  return (
    <WalletItemContainer
      className={selectedIndex ? 'selected-wallet-name' : ''}
    >
      <WalletName title={name}>{name}</WalletName>
      <WalletTotalBalance title={totalBalanceWithLocale + ''}>
        {totalBalanceWithLocale}
      </WalletTotalBalance>
    </WalletItemContainer>
  );
};

export default Name;
