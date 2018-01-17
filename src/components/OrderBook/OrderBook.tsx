import {defaultTo} from 'rambda';
import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import styled from 'styled-components';
import {Order} from '../../models';
import {Table} from '../Table/index';
import {OrderBookItem} from './';

const StyledTable = styled(Table)`
  height: inherit;
  position: absolute;
  left: 0;
`;

const StyledHead = styled.thead`
  display: block;
  position: absolute;
  width: 100%;
  left: 0;
  background: #333;
  z-index: 1;
`;

const StyledRow = styled.tr`
  display: flex;
  justify-content: space-evenly;
  padding-right: 30px;
`;

const StyledSellOrders = styled.tbody`
  display: block;
  margin-top: 34px;
`;

const StyledBuyOrders = styled(StyledSellOrders)`
  margin-top: 0;
`;

const StyledMidPrice = styled.tbody`
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
`;

const StyledHeader = styled.th`
  flex-grow: 1;
  text-align: ${(p: any) => p.align} !important;
` as any;

interface OrderBookProps {
  asks: Order[];
  bids: Order[];
  mid: number;
}

const OrderBook: React.SFC<OrderBookProps> = ({
  asks = [],
  mid = 0,
  bids = []
}) => {
  return (
    <StyledTable>
      <StyledHead>
        <StyledRow>
          <StyledHeader align="right">Sell</StyledHeader>
          <StyledHeader align="center">Price</StyledHeader>
          <StyledHeader align="left">Buy</StyledHeader>
        </StyledRow>
      </StyledHead>
      <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={250}>
        <StyledSellOrders>
          {asks.map(order => <OrderBookItem key={order.id} {...order} />)}
        </StyledSellOrders>
      </Scrollbars>
      <StyledMidPrice>
        <tr>
          <td>{defaultTo('', Number(mid))}</td>
        </tr>
      </StyledMidPrice>
      <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={250}>
        <StyledBuyOrders>
          {bids.map(order => <OrderBookItem key={order.id} {...order} />)}
        </StyledBuyOrders>
      </Scrollbars>
    </StyledTable>
  );
};

export default OrderBook;
