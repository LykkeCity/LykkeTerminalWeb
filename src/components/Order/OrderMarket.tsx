import {Form, withFormik} from 'formik';
import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import orderAction from '../../constants/orderAction';
import {capitalize} from '../../utils';
import NumberInput from '../NumberInput/NumberInput';
import {
  OrderBasicFormProps,
  StyledActionTitle,
  StyledInputControl,
  StyledReset
} from './index';
import OrderButton from './OrderButton';
import OrderPercentage from './OrderPercentage';

const StyledOrderButton = styled.div`
  margin-top: ${rem(24)};
`;

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

interface OrderBasicFormState {
  action: string;
}

class OrderMarket extends React.Component<
  OrderBasicFormProps,
  OrderBasicFormState
> {
  private isInverted: boolean = false;

  constructor(props: OrderBasicFormProps) {
    super(props);

    this.state = {
      action: this.props.action
    };
  }

  onInvert = () => {
    this.isInverted = !this.isInverted;
    this.setState({
      action: !this.isInverted
        ? this.props.action
        : this.state.action === orderAction.sell.action
          ? orderAction.buy.action
          : orderAction.sell.action
    });
  };

  render() {
    const baseName = this.props.assetName.split('/')[0];
    const quoteName = this.props.assetName.split('/')[1];

    return (
      <div>
        <Flex>
          <Flex column={true} style={{width: '75%'}}>
            <Flex>
              <StyledInputControl style={{width: '100%'}}>
                <Flex justify="space-between">
                  <StyledActionTitle>
                    {this.state.action}{' '}
                    {!this.isInverted ? baseName : quoteName}
                  </StyledActionTitle>
                  <div>
                    {this.props.balance}{' '}
                    {this.props.isSell ? baseName : quoteName} available
                  </div>
                </Flex>
                <NumberInput
                  value={this.props.quantity}
                  id={'quantityValue'}
                  onChange={this.props.onChange(this.props.quantityAccuracy)}
                  onArrowClick={this.props.onArrowClick(
                    this.props.quantityAccuracy
                  )}
                />
              </StyledInputControl>
            </Flex>
            <Flex>
              <Flex justify={'space-between'} style={{width: '100%'}}>
                {this.props.percents!.map((item: any, index: number) => (
                  <OrderPercentage
                    percent={item.percent}
                    key={index}
                    onClick={this.props.onHandlePercentageChange(index)}
                    isActive={item.isActive}
                  />
                ))}
              </Flex>
            </Flex>
          </Flex>
          <Flex align={'center'}>
            <Box onClick={this.onInvert}>invert</Box>
            <Box>{this.isInverted ? baseName : quoteName}</Box>
          </Flex>
        </Flex>
        <StyledOrderButton>
          <OrderButton
            action={this.props.action}
            isDisable={this.props.isDisable}
            type={'submit'}
            message={`${capitalize(this.props.action)} ${
              this.props.quantity
            } ${baseName}`}
          />
        </StyledOrderButton>
        <StyledReset justify={'center'}>
          <span onClick={this.props.onReset}>Reset and clear</span>
        </StyledReset>
      </div>
    );
  }
}

const OrderMarketForm: React.SFC<OrderBasicFormProps> = (
  props: OrderBasicFormProps
) => {
  return (
    <Form>
      <OrderMarket {...props} />
    </Form>
  );
};

export default withFormik<OrderBasicFormProps, {}>({
  handleSubmit: (values, {props}) => {
    const {action} = props;
    props.onSubmit(action);
  }
})(OrderMarketForm);
