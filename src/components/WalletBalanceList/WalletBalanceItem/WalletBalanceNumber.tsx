import * as React from 'react';
import {formattedNumber} from '../../../utils/localFormatted/localFormatted';
import styled from '../../styled';

const StyledNumber = styled.div`
  color: ${(p: any) => p.color};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  span {
    color: #f5f6f7;
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
  color = '#ffffff',
  children
}) => {
  if (num === undefined || num === null) {
    return null;
  }
  const formatterNum = formattedNumber(num, accuracy);
  return (
    <StyledNumber color={color} title={formatterNum}>
      {formatterNum}
      {children}
    </StyledNumber>
  );
};

export default WalletBalanceNumber;
