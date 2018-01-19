import {defaultTo} from 'rambda';
import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import styled from 'styled-components';
import {Order} from '../../models';
import {Cell, Table} from '../Table/index';
import {OrderBookItem} from './';

const StyledTable = styled(Table)`
  height: inherit;
  position: absolute;
  left: 0;
`;

const StyledHead = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  background: #333;
  z-index: 1;
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const StyledSellOrders = styled.div`
  margin-top: 34px;
`;

const StyledBuyOrders = styled(StyledSellOrders)`
  margin-top: 0;
`;

const StyledMidPrice = styled.div`
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
`;

const StyledHeader = styled(Cell(3))`
  flex-grow: 1;
  text-align: ${(p: any) => p.align} !important;
` as any;

interface OrderBookProps {
  asks: Order[];
  bids: Order[];
  mid: number;
}

class OrderBook extends React.Component<OrderBookProps> {
  private scrollbarAsks: any;

  constructor(props: OrderBookProps) {
    super(props);
  }

  componentDidUpdate() {
    this.scrollbarAsks.scrollToBottom();
  }

  render() {
    const asks = this.props.asks;
    const mid = this.props.mid;
    const bids = this.props.bids;

    return (
      <StyledTable>
        <StyledHead className="thead">
          <StyledRow className="tr">
            <StyledHeader className="th" align="right">
              Sell
            </StyledHeader>
            <StyledHeader className="th" align="center">
              Price
            </StyledHeader>
            <StyledHeader className="th" align="left">
              Buy
            </StyledHeader>
          </StyledRow>
        </StyledHead>
        <Scrollbars
          autoHide={true}
          autoHeight={true}
          autoHeightMax={250}
          ref={c => {
            this.scrollbarAsks = c;
          }}
        >
          <StyledSellOrders className="tbody">
            {asks.map(order => <OrderBookItem key={order.id} {...order} />)}
          </StyledSellOrders>
        </Scrollbars>
        <StyledMidPrice className="tbody">
          <div className="tr">
            <div className="td">{defaultTo('', Number(mid))}</div>
          </div>
        </StyledMidPrice>
        <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={250}>
          <StyledBuyOrders className="tbody">
            {bids.map(order => <OrderBookItem key={order.id} {...order} />)}
          </StyledBuyOrders>
        </Scrollbars>
      </StyledTable>
    );
  }
}

export default OrderBook;
