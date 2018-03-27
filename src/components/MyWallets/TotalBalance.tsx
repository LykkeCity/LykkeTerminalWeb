import * as React from 'react';

interface TotalBalance {
  total: number;
  accuracy?: number;
  name?: string;
}

const TotalBalance: React.SFC<TotalBalance> = ({total, accuracy, name}) => {
  return (
    <div>
      Total Balance: {total.toFixed(accuracy)} {name}
    </div>
  );
};
export default TotalBalance;
