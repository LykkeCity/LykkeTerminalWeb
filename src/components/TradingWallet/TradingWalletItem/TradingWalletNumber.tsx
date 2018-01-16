import * as React from 'react';
import styled from '../../styled';

const StyledNumber = styled.div`
  color: #8c94a0;
  span {
    color: #f5f6f7;
  }
`;

const TradingWalletNumber = ({num}: {num: string}) => {
  const sepIdx = num.indexOf('.') + 1;
  return (
    <StyledNumber>
      <span>{num.substr(0, sepIdx)}</span>
      {num.substr(sepIdx)}
    </StyledNumber>
  );
};

export default TradingWalletNumber;
