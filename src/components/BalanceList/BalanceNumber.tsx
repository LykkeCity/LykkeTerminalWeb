import * as React from 'react';
import {FormattedNumber} from 'react-intl';
import styled from '../styled';

const StyledBalanceNumber = styled.div`
  color: #f5f6f7;
  font-weight: bold;
`;

const BalanceNumber: React.SFC<{num: string}> = ({num, children}) => (
  <StyledBalanceNumber>
    <FormattedNumber value={+num} />
    {children}
  </StyledBalanceNumber>
);

export default BalanceNumber;
