import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {OrderInputs} from '../../models';
import NumberInput from '../NumberInput/NumberInput';
import {OrderFormProps} from './index';

const StyledOrderOptions = styled.div`
  margin: 10px 0 0 0;
`;

const StyledOptions = styled.div`
  display: flex;
  flex-direction: row;
  margin: ${rem(8)} 0 0 0;
  height: 32px;
`;

const StyledAmount = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  font-size: ${rem(14)};
  color: #8c94a0;
`;

const StyledTitle = styled.div`
  font-size: ${rem(14)};
  font-weight: 600;
  color: #f5f6f7;
  line-height: 1.5;
  margin-top: ${rem(16)};
`;

const StyledInputNumberComponent = styled.div`
  position: sticky;

  > span.up,
  > span.down {
    content: '';
    position: absolute;
    right: 5px;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-bottom: 6px solid #f5f6f7;
    z-index: 5;

    &:hover {
      cursor: pointer;
    }
  }

  > span.up {
    top: 8px;
  }

  > span.down {
    bottom: 8px;
    transform: rotate(180deg);
  }
`;

// TODO should be deleted after design updating
const OrderInput: React.SFC<OrderFormProps> = (props: OrderFormProps) => {
  const {onChange, onArrowClick, price, quantity, amount, assetName} = props;

  const quoteName = assetName.split('/')[1];

  return (
    <StyledOrderOptions>
      <StyledTitle>Quantity</StyledTitle>
      <StyledOptions>
        <StyledInputNumberComponent>
          <NumberInput
            value={quantity}
            id={OrderInputs.Quantity}
            onChange={onChange()}
            onArrowClick={onArrowClick()}
          />
        </StyledInputNumberComponent>
      </StyledOptions>
      <StyledTitle>Price</StyledTitle>
      <StyledOptions>
        <StyledInputNumberComponent>
          <NumberInput
            value={price}
            id={OrderInputs.Price}
            onChange={onChange(2)}
            onArrowClick={onArrowClick(2)}
          />
        </StyledInputNumberComponent>
        <StyledAmount>
          Total: {amount} {quoteName}
        </StyledAmount>
      </StyledOptions>
    </StyledOrderOptions>
  );
};

export default OrderInput;
