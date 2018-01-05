import * as React from 'react';
import styled from 'styled-components';
import {OrderTumbler} from './index';

const StyledTumblerWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledDiv = styled.div`
  width: 60px;
  height: 32px;
  opacity: 0.4;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  border: solid 1px rgba(140, 148, 160, 0.4);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #fff;
`;

const OrderTumbler: React.SFC<OrderTumbler> = ({tumblers}) => {
  return (
    <StyledTumblerWrap>
      {tumblers.map((tumbler, index) => {
        return <StyledDiv key={index}>{tumbler}</StyledDiv>;
      })}
    </StyledTumblerWrap>
  );
};

export default OrderTumbler;
