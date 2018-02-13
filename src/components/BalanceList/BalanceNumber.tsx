import * as React from 'react';
import styled from '../styled';

const StyledBalanceNumber = styled.div`
  color: #8c94a0;
  span {
    color: #f5f6f7;
  }
`;

const BalanceNumber = ({num}: {num: string}) => {
  const sepIdx = num.indexOf('.') + 1;
  const int = sepIdx > 0 ? num.substr(0, sepIdx) : num;
  const fractional = sepIdx > 0 ? num.substr(sepIdx) : '';
  return (
    <StyledBalanceNumber>
      <span>{int}</span>
      {fractional}
    </StyledBalanceNumber>
  );
};

export default BalanceNumber;
