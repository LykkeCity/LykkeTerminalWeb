import * as React from 'react';
import styled from 'styled-components';
import {WalletNameProps} from './index';

const StyledWalletNameButtonSelected = styled.div`
  width: 272px;
  height: 32px;
  border-radius: 2px;
  background-color: #3c3c3c;
  padding: 10px;
`;
const StyledWalletNameButton = styled.div`
  width: 272px;
  height: 32px;
  opacity: 0.5;
  border-radius: 2px;
  background-color: #3c3c3c;
  padding: 10px;
`;
const InnerContainerButton = styled.div`
  display: flex;
`;

const StyledWalletName = styled.div`
  width: 89px;
  height: 17px;
  font-family: ProximaNova;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #f5f6f7;
  color: var(--pale-grey);
`;
const CostOfWallet = styled.div`
  width: 91px;
  height: 17px;
  font-family: ProximaNova;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #f5f6f7;
  color: var(--pale-grey);
`;

const WalletName: React.SFC<WalletNameProps> = ({name, selectedIndex}) => {
  const content = (
    <InnerContainerButton>
      <StyledWalletName>{name}</StyledWalletName>
      <CostOfWallet>{5000 + 'PTC'}</CostOfWallet>
    </InnerContainerButton>
  );
  if (selectedIndex) {
    return (
      <StyledWalletNameButtonSelected>{content}</StyledWalletNameButtonSelected>
    );
  } else {
    return <StyledWalletNameButton>{content}</StyledWalletNameButton>;
  }
};

export default WalletName;
