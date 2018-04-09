import * as React from 'react';
import styled from '../styled';

const StyledBalanceNumber = styled.div`
  color: #f5f6f7;
  font-weight: bold;
`;

interface BalanceNumberProps {
  num: number;
  accuracy: number;
}

const BalanceNumber: React.SFC<BalanceNumberProps> = ({
  num,
  accuracy,
  children
}) => (
  <StyledBalanceNumber>
    {num.toLocaleString(undefined, {
      maximumFractionDigits: accuracy
    })}
    {children}
  </StyledBalanceNumber>
);

export default BalanceNumber;
