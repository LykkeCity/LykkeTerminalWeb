import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import NumberInput from '../NumberInput/NumberInput';
import {OrderOptionProps} from './index';
import OrderTumbler from './OrderTumbler';

const StyledOrderOptions = styled.div`
  margin: 10px 0 0 0;
`;

const StyledTitle = styled.span`
  font-size: ${rem(14)};
  font-weight: 600;
  color: #f5f6f7;
`;

const StyledOptions = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0 0 0;
`;

const OrderOption: React.SFC<OrderOptionProps> = ({
  title,
  isOptional,
  tumblerValues,
  change,
  inputValue
}) => {
  return (
    <StyledOrderOptions>
      <div>
        {isOptional ? (
          <input type="checkbox" /> // todo have to be styled
        ) : null}
        <StyledTitle>{title}</StyledTitle>
      </div>
      <StyledOptions>
        <OrderTumbler tumblers={tumblerValues} />
        <NumberInput inputValue={inputValue} change={change} />
      </StyledOptions>
    </StyledOrderOptions>
  );
};

export default OrderOption;
