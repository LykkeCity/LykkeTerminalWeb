import * as React from 'react';
import styled from '../styled';
import {Table} from '../Table/index';

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

const BalanceList = () => (
  <Table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Balance</th>
        <th>PnL</th>
      </tr>
    </thead>
    <tbody>
      {new Array(3)
        .fill({
          b: 10000 * Math.random(),
          pnl: 0 * Math.random(),
          s: 'BTC'
        })
        .map((x: any, idx) => (
          <tr key={idx}>
            <td>{x.s}</td>
            <td>
              <BalanceNumber num={x.b.toFixed(2)} />
            </td>
            <td>
              <BalanceNumber num={x.pnl.toFixed(2)} />
            </td>
          </tr>
        ))}
    </tbody>
  </Table>
);

export default BalanceList;
