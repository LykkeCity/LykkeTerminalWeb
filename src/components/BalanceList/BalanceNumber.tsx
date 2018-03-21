import * as React from 'react';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import styled from '../styled';

const StyledBalanceNumber = styled.div`
  color: #f5f6f7;
  font-weight: bold;
`;

const BalanceNumber: React.SFC<{num: string}> = ({num, children}) => (
  <StyledBalanceNumber>
    {formattedNumber(+num)}
    {children}
  </StyledBalanceNumber>
);

export default BalanceNumber;
