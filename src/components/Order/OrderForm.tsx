import {Form, withFormik} from 'formik';
import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {OrderFormProps} from './index';
import OrderButton from './OrderButton';

const StyledOrderOptions = styled.div`
  margin: 10px 0 0 0;
`;

const StyledOptions = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0 0 0;
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
  margin-top: 10px;
`;

const StyledOrderButton = styled.div`
  margin-top: ${rem(24)};
`;

const StyledInput = styled.input`
  background-color: transparent;
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: #f5f6f7;
  padding-left: 5px;
  width: 128px;
  box-sizing: border-box;
  height: 100%;

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    cursor: pointer;
    display: block;
    width: 10px;
    background: transparent;
  }
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
    border-bottom: 6px solid #fff;
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

const OrderForm = (props: OrderFormProps) => {
  const {
    onChange,
    onArrowClick,
    price,
    isDisable,
    isMarket,
    assetName,
    action,
    quantity,
    amount
  } = props;

  const baseName = assetName.split('/')[0];
  const quoteName = assetName.split('/')[1];

  return (
    <Form>
      <StyledOrderOptions>
        {!isMarket ? (
          <div>
            <StyledTitle>Price</StyledTitle>
            <StyledOptions>
              <StyledInputNumberComponent>
                <StyledInput
                  id="priceValue"
                  type="text"
                  value={price}
                  onChange={onChange('priceValue')}
                  name="priceValue"
                />
                <span
                  className="up"
                  onClick={onArrowClick('up', 'priceValue')}
                />
                <span
                  className="down"
                  onClick={onArrowClick('down', 'priceValue')}
                />
              </StyledInputNumberComponent>
            </StyledOptions>
          </div>
        ) : null}

        <StyledTitle>Quantity</StyledTitle>
        <StyledOptions>
          <StyledInputNumberComponent>
            <StyledInput
              id="quantityValue"
              type="text"
              value={quantity}
              onChange={onChange('quantityValue')}
              // tslint:disable-next-line:jsx-no-lambda
              onKeyDown={e => {
                switch (e.keyCode) {
                  case 38:
                    onArrowClick('up', 'quantityValue')();
                    e.preventDefault();
                    break;
                  case 40:
                    onArrowClick('down', 'quantityValue')();
                    e.preventDefault();
                    break;
                  default:
                    break;
                }
              }}
              name="quantityValue"
            />
            <span
              className="up"
              onClick={onArrowClick('up', 'quantityValue')}
            />
            <span
              className="down"
              onClick={onArrowClick('down', 'quantityValue')}
            />
          </StyledInputNumberComponent>
          <StyledAmount>
            Total: {amount} {quoteName}
          </StyledAmount>
        </StyledOptions>
      </StyledOrderOptions>

      <StyledOrderButton>
        <OrderButton
          action={action}
          price={amount}
          baseName={baseName}
          quantity={quantity}
          isDisable={isDisable}
          type={'submit'}
        />
      </StyledOrderButton>
    </Form>
  );
};

export default withFormik<OrderFormProps, {}>({
  handleSubmit: (values, {props}) => {
    const {action} = props;
    props.onSubmit(action);
  }
})(OrderForm);
