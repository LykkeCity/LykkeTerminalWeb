import {Form, withFormik} from 'formik';
import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {keyCodes} from '../../constants/keyCodes';
import {OrderFormProps} from './index';
import OrderButton from './OrderButton';

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

class OrderFormClass extends React.Component<{parentProps: any}> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    document.body.addEventListener('keyup', this.handleSubmit);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keyup', this.handleSubmit);
  }

  handleSubmit = (e: any) => {
    if (e.keyCode !== keyCodes.Enter || this.props.parentProps.isDisable) {
      return;
    }
    this.props.parentProps.handleSubmit(e);
  };

  render() {
    return (
      <div>
        <StyledOrderOptions>
          <StyledTitle>Quantity</StyledTitle>
          <StyledOptions>
            <StyledInputNumberComponent>
              <StyledInput
                id="quantityValue"
                type="text"
                value={this.props.parentProps.quantity}
                onChange={this.props.parentProps.onChange('quantityValue')}
                // tslint:disable-next-line:jsx-no-lambda
                onKeyDown={e => {
                  switch (e.keyCode) {
                    case 38:
                      this.props.parentProps.onArrowClick(
                        'up',
                        'quantityValue'
                      )();
                      e.preventDefault();
                      break;
                    case 40:
                      this.props.parentProps.onArrowClick(
                        'down',
                        'quantityValue'
                      )();
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
                onClick={this.props.parentProps.onArrowClick(
                  'up',
                  'quantityValue'
                )}
              />
              <span
                className="down"
                onClick={this.props.parentProps.onArrowClick(
                  'down',
                  'quantityValue'
                )}
              />
            </StyledInputNumberComponent>
          </StyledOptions>
          {!this.props.parentProps.isMarket ? (
            <div>
              <StyledTitle>Price</StyledTitle>
              <StyledOptions>
                <StyledInputNumberComponent>
                  <StyledInput
                    id="priceValue"
                    type="text"
                    value={this.props.parentProps.price}
                    onChange={this.props.parentProps.onChange('priceValue')}
                    // tslint:disable-next-line:jsx-no-lambda
                    onKeyDown={e => {
                      switch (e.keyCode) {
                        case 38:
                          this.props.parentProps.onArrowClick(
                            'up',
                            'priceValue'
                          )();
                          e.preventDefault();
                          break;
                        case 40:
                          this.props.parentProps.onArrowClick(
                            'down',
                            'priceValue'
                          )();
                          e.preventDefault();
                          break;
                        default:
                          break;
                      }
                    }}
                    name="priceValue"
                  />
                  <span
                    className="up"
                    onClick={this.props.parentProps.onArrowClick(
                      'up',
                      'priceValue'
                    )}
                  />
                  <span
                    className="down"
                    onClick={this.props.parentProps.onArrowClick(
                      'down',
                      'priceValue'
                    )}
                  />
                </StyledInputNumberComponent>
                <StyledAmount>
                  Total: {this.props.parentProps.amount}{' '}
                  {this.props.parentProps.assetName.split('/')[1]}
                </StyledAmount>
              </StyledOptions>
            </div>
          ) : null}
        </StyledOrderOptions>
        <StyledOrderButton>
          <OrderButton
            action={this.props.parentProps.action}
            price={this.props.parentProps.amount}
            baseName={this.props.parentProps.assetName.split('/')[0]}
            quantity={this.props.parentProps.quantity}
            isDisable={this.props.parentProps.isDisable}
            type={'submit'}
          />
        </StyledOrderButton>
      </div>
    );
  }
}

const OrderForm = (props: OrderFormProps) => {
  return (
    <Form>
      <OrderFormClass parentProps={props} />
    </Form>
  );
};

export default withFormik<OrderFormProps, {}>({
  handleSubmit: (values, {props}) => {
    const {action} = props;
    props.onSubmit(action);
  }
})(OrderForm);
