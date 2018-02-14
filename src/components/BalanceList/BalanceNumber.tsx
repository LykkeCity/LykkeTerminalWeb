import * as React from 'react';
import styled from '../styled';

const StyledBalanceNumber = styled.div`
  color: #f5f6f7;
  font-weight: bold;
`;

const BalanceNumber = ({num}: {num: string}) => (
  <StyledBalanceNumber>{num}</StyledBalanceNumber>
);

export default BalanceNumber;
