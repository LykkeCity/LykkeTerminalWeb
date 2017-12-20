import * as React from 'react';
import styled from '../../styled';

const StyledBalanceNumber = styled.div`
  color: #8c94a0;
  span {
    color: #f5f6f7;
  }
`;

const BalanceNumber = ({num}: {num: string}) => {
  const sepIdx = num.indexOf('.') + 1;
  return (
    <StyledBalanceNumber>
      <span>{num.substr(0, sepIdx)}</span>
      {num.substr(sepIdx)}
    </StyledBalanceNumber>
  );
};

export default BalanceNumber;
