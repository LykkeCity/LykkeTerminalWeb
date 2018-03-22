import {Form, FormikProps, withFormik} from 'formik';
import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import orderAction from '../../constants/orderAction';
import {OrderInputs} from '../../models';
import {capitalize} from '../../utils';
import NumberInput from '../NumberInput/NumberInput';
import {
  OrderMarketProps,
  OrderMarketState,
  StyledActionTitle,
  StyledInputControl,
  StyledReset
} from './index';
import OrderButton from './OrderButton';
import OrderPercentage from './OrderPercentage';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

const StyledOrderButton = styled.div`
  margin-top: ${rem(24)};
`;

const StyledInvertedBtn = Box.extend`
  background: url('assets/images/invert.png') no-repeat center;
  border: 1px solid rgba(140, 148, 160, 0.4);
  border-radius: 4px;
  width: 32px;
  height: 32px;
  margin: 0 8px;

  &:hover {
    cursor: pointer;
  }
`;

class OrderMarket extends React.Component<
  OrderMarketProps & FormikProps<{}>,
  OrderMarketState
> {
  private isInverted: boolean = false;
  private previousPropsAction: string;

  constructor(props: OrderMarketProps & FormikProps<{}>) {
    super(props);

    this.state = {
      action: this.props.action
    };
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.previousPropsAction !== nextProps.action) {
      this.setState({
        action: nextProps.action
      });
      this.isInverted = false;
      this.updateInvertedValues(nextProps.action);
    }
  }

  updateInvertedValues = (action: any) => {
    this.props.setValues({
      invertedAction: action,
      isInverted: this.isInverted
    });
  };

  onInvert = () => {
    this.props.onResetPercentage();
    this.isInverted = !this.isInverted;
    const action = !this.isInverted
      ? this.props.action
      : this.state.action === orderAction.sell.action
        ? orderAction.buy.action
        : orderAction.sell.action;
    this.setState({
      action
    });
    this.updateInvertedValues(action);
  };

  reset = () => {
    this.setState({
      action: this.props.action
    });
    this.isInverted = false;
    this.updateInvertedValues(null);
    this.props.onReset();
  };

  handlePercentageChange = (index: number) => () => {
    this.props.onHandlePercentageChange(index)(this.isInverted);
  };

  render() {
    const {baseName, quoteName} = this.props;
    this.previousPropsAction = this.props.action;
    const {quantityAccuracy, priceAccuracy, quantity} = this.props;
    const currentAccuracy = this.isInverted ? priceAccuracy : quantityAccuracy;
    const currentQuantity = parseFloat(quantity).toFixed(currentAccuracy);

    return (
      <div>
        <div>
          <div>
            <div style={{width: '75%'}}>
              <Flex justify="space-between">
                <StyledActionTitle>
                  {this.state.action} {!this.isInverted ? baseName : quoteName}
                </StyledActionTitle>
                <div>
                  {this.props.balance}{' '}
                  {this.props.isSell ? baseName : quoteName} available
                </div>
              </Flex>
            </div>
          </div>
          <Flex>
            <StyledInputControl style={{width: '75%'}}>
              <NumberInput
                value={currentQuantity}
                id={OrderInputs.Quantity}
                onChange={this.props.onChange(currentAccuracy)}
                onArrowClick={this.props.onArrowClick(currentAccuracy)}
              />
            </StyledInputControl>
            <Flex align={'center'}>
              <StyledInvertedBtn onClick={this.onInvert} />
              <Box>{this.isInverted ? baseName : quoteName}</Box>
            </Flex>
          </Flex>
          <div style={{width: '75%'}}>
            <Flex justify={'space-between'} style={{width: '100%'}}>
              {this.props.percents!.map((item: any, index: number) => (
                <OrderPercentage
                  percent={item.percent}
                  key={index}
                  onClick={this.handlePercentageChange(index)}
                  isActive={item.isActive}
                />
              ))}
            </Flex>
          </div>
        </div>
        <StyledOrderButton>
          <OrderButton
            action={this.props.action}
            isDisable={this.props.isDisable}
            type={'submit'}
            message={`${capitalize(this.state.action)} ${currentQuantity} ${
              !this.isInverted ? baseName : quoteName
            }`}
          />
        </StyledOrderButton>
        <StyledReset justify={'center'}>
          <span onClick={this.reset}>Reset and clear</span>
        </StyledReset>
      </div>
    );
  }
}

const OrderMarketForm: React.SFC<OrderMarketProps & FormikProps<{}>> = (
  props: OrderMarketProps & FormikProps<{}>
) => {
  return (
    <Form>
      <OrderMarket {...props} />
    </Form>
  );
};

export default withFormik<OrderMarketProps, {}>({
  handleSubmit: (values: any, {props}) => {
    const {
      action,
      baseName,
      quoteName,
      quantityAccuracy,
      priceAccuracy
    } = props;
    const {invertedAction, isInverted} = values;
    props.onSubmit(
      invertedAction || action,
      isInverted ? quoteName : baseName,
      isInverted ? baseName : quoteName,
      isInverted ? priceAccuracy : quantityAccuracy
    );
  }
})(OrderMarketForm);
