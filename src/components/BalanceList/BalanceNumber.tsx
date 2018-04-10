import * as React from 'react';
import styled from '../styled';

const StyledBalanceNumber = styled.div`
  color: #f5f6f7;
  font-weight: bold;
`;

interface BalanceNumberProps {
  num: string;
}

const BalanceNumber: React.SFC<BalanceNumberProps> = ({num, children}) => (
  <StyledBalanceNumber>
    {num}
    {children}
  </StyledBalanceNumber>
);

export default BalanceNumber;
