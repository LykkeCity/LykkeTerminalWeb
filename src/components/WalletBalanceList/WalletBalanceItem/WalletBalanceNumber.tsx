import * as React from 'react';
import {FormattedNumber} from 'react-intl';
import styled from '../../styled';

const StyledNumber = styled.div.attrs({})`
  color: ${(p: any) => p.color};
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
  const price = num.toFixed(accuracy).replace(/[.,]?0+$/, '');
  return (
    <StyledNumber color={color}>
      <FormattedNumber value={+price} />
      {children}
    </StyledNumber>
  );
};

export default WalletBalanceNumber;
