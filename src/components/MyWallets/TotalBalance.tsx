import * as React from 'react';
import {Total, TotalAmount, TotalLabel} from './styles';

interface TotalBalanceProps {
  total: number;
  accuracy?: number;
  name?: string;
}

const TotalBalance: React.SFC<TotalBalanceProps> = ({
  total,
  accuracy,
  name
}) => (
  <Total>
    <TotalAmount>
      {total.toLocaleString(undefined, {maximumFractionDigits: accuracy})}{' '}
      {name}
    </TotalAmount>
    <TotalLabel>Total Balance</TotalLabel>
  </Total>
);

export default TotalBalance;
