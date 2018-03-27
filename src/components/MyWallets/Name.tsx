import * as React from 'react';
import {
  Button,
  ButtonSelected,
  CostOfWallet,
  InnerContainerButton,
  StyledName
} from './styled';

interface WalletNameProps {
  name: string;
  selectedIndex: boolean;
  baseAssetName: string;
  wallets?: number;
  accuracy: number;
}

const Name: React.SFC<WalletNameProps> = ({
  name,
  selectedIndex,
  baseAssetName,
  wallets,
  accuracy
}) => {
  const content = (
    <InnerContainerButton>
      <StyledName>{name}</StyledName>
      <CostOfWallet>
        {(wallets ? wallets.toFixed(accuracy) : 0) + ' ' + baseAssetName}
      </CostOfWallet>
    </InnerContainerButton>
  );
  if (selectedIndex) {
    return <ButtonSelected>{content}</ButtonSelected>;
  } else {
    return <Button>{content}</Button>;
  }
};

export default Name;
