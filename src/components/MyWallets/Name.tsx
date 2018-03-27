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
}

const Name: React.SFC<WalletNameProps> = ({name, selectedIndex}) => {
  const content = (
    <InnerContainerButton>
      <StyledName>{name}</StyledName>
      <CostOfWallet>{5000 + 'PTC'}</CostOfWallet>
    </InnerContainerButton>
  );
  if (selectedIndex) {
    return <ButtonSelected>{content}</ButtonSelected>;
  } else {
    return <Button>{content}</Button>;
  }
};

export default Name;
