import * as React from 'react';
import styled from '../../styled';

const StyledNumber = styled.div.attrs({})`
  color: ${(p: any) => p.color};
  span {
    color: #f5f6f7;
  }
`;

interface WalletBalanceNumberProps {
  num: string;
  color?: string;
}

const WalletBalanceNumber: React.SFC<WalletBalanceNumberProps> = ({
  num,
  color = '#ffffff',
  children
}) => {
  if (num === undefined || num === null) {
    return null;
  }
  return (
    <StyledNumber color={color}>
      {num}
      {children}
    </StyledNumber>
  );
};

export default WalletBalanceNumber;
