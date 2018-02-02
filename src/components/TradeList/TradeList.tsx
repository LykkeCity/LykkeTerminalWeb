import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {TradeModel} from '../../models/index';
import {Table} from '../Table/index';
import {TradeListItem} from './';
// import {rem} from "polished";

interface TradeListProps {
  trades?: TradeModel[];
  fetchPart: any;
}

const StyledBtnSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  width: 100%;
`;

const StyledBtn = styled.span`
  margin-right: 5px;
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: #fff;
  padding: ${rem(8)} ${rem(18)};

  &:hover {
    cursor: pointer;
  }
`;

const TradeList: React.SFC<TradeListProps> = ({trades = [], fetchPart}) => (
  <div>
    <Table>
      <thead>
        <tr>
          <th>Asset</th>
          <th>Volume</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {trades.map(trade => <TradeListItem key={trade.tradeId} {...trade} />)}
      </tbody>
    </Table>
    <StyledBtnSection>
      <StyledBtn onClick={fetchPart}>Load more...</StyledBtn>
    </StyledBtnSection>
  </div>
);

export default TradeList;
