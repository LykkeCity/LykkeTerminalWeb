import {rgb} from 'polished';
import * as React from 'react';
import styled from '../styled';

const StyledNumber = styled.span`
  color: ${(p: any) => p.color};
  text-align: right;
  span {
    color: ${rgb(245, 246, 247)};
  }
`;

interface WalletBalanceNumberProps {
  num: number;
  accuracy: number;
  color?: string;
}

const WalletBalanceNumber: React.SFC<WalletBalanceNumberProps> = ({
  num,
  accuracy,
  color,
  children
}) => (
  <StyledNumber color={color}>
    {num.toLocaleString(undefined, {maximumFractionDigits: accuracy})}
    {children}
  </StyledNumber>
);

export default WalletBalanceNumber;
