import * as React from 'react';
import styled from 'styled-components';
import {Table} from '../Table/index';
import {OrderBookItem} from './';
import {OrderBookProps} from './';

const StyledTable = styled(Table)`
  height: inherit;
  position: relative;
`;

const StyledHead = styled.thead`
  display: block;
  position: absolute;
  width: 100%;
  left: 0;
`;

const StyledRow = styled.tr`
  display: flex;
  justify-content: space-evenly;
  padding-right: 30px;
`;

const StyledSellOrders = styled.tbody`
  display: block;
  margin-top: 34px;
  overflow: auto;
  height: 50%;
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
`;

const OrderBook: React.SFC<OrderBookProps> = ({
  buyOrders = [],
  midPrice = 0,
  sellOrders = []
}) => {
  return (
    <StyledTable>
      <StyledHead>
        <StyledRow>
          <StyledHeader style={{textAlign: 'right'}}>Sell</StyledHeader>
          <StyledHeader style={{textAlign: 'center'}}>Price</StyledHeader>
          <StyledHeader style={{textAlign: 'left'}}>Buy</StyledHeader>
        </StyledRow>
      </StyledHead>
      <StyledSellOrders>
        {sellOrders.map((order: any, index: number) => (
          <OrderBookItem
            key={`orderitem_${index}`}
            maxVolume={Math.max(
              ...sellOrders.map(x => x.ask).concat(sellOrders.map(x => x.ask))
            )}
            {...order}
          />
        ))}
      </StyledSellOrders>
      {midPrice ? (
        <StyledMidPrice>
          <tr>
            <td>{midPrice}</td>
          </tr>
        </StyledMidPrice>
      ) : null}
      <StyledBuyOrders>
        {buyOrders.map((order: any, index: number) => (
          <OrderBookItem
            key={`orderitem_${index}`}
            maxVolume={Math.max(
              ...buyOrders.map(x => x.bid).concat(buyOrders.map(x => x.bid))
            )}
            {...order}
          />
        ))}
      </StyledBuyOrders>
    </StyledTable>
  );
};

export default OrderBook;
