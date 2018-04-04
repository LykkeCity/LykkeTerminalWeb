import * as React from 'react';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
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
  const content = (
    <WalletItemContainer>
      <WalletName>{name}</WalletName>
      <WalletTotalBalance>
        {totalBalance &&
          formattedNumber(totalBalance, accuracy) + ' ' + baseAssetName}
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
