import * as React from 'react';
import {NameOfTotal, TotalContainer, TotalPrice} from './styled';

interface TotalBalance {
  total: number;
  accuracy?: number;
  name?: string;
}

const TotalBalance: React.SFC<TotalBalance> = ({total, accuracy, name}) => {
  return (
    <TotalContainer>
      <TotalPrice>
        {total.toFixed(accuracy)} {name}
      </TotalPrice>
      <NameOfTotal>Total Balance</NameOfTotal>
    </TotalContainer>
  );
};
export default TotalBalance;
