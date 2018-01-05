import * as React from 'react';
import styled from 'styled-components';
import {OrderHeaderProps} from './index';

const StyledHeader = styled.div`
  border-bottom: solid 1px rgba(0, 0, 0, 0.2);
  font-size: 20px;
  font-weight: bold;
  line-height: 0.8;
  color: #f5f6f7;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 24px;
`;

const StyledCloseBtn = styled.a`
  color: #f5f6f7;
  text-decoration: none;
  cursor: pointer;
`;

const OrderHeader: React.SFC<OrderHeaderProps> = ({orderCurrency, click}) => {
  return (
    <StyledHeader>
      <div>{orderCurrency}</div>
      <StyledCloseBtn href="#" onClick={click}>
        &times;
      </StyledCloseBtn>
    </StyledHeader>
  );
};

export default OrderHeader;
