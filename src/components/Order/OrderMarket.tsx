import {Form, FormikProps, withFormik} from 'formik';
import * as React from 'react';
import orderAction from '../../constants/orderAction';
import {OrderInputs} from '../../models';
import {capitalize} from '../../utils';
import NumberInput from '../NumberInput/NumberInput';
import {OrderBasicFormProps} from './index';
import OrderButton from './OrderButton';
import OrderPercentage from './OrderPercentage';
import {
  Action,
  Amount,
  InputControl,
  MarketConfirmButton,
  Reset
} from './styles';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

interface OrderMarketState {
  action: string;
}

export interface OrderMarketProps extends OrderBasicFormProps {
  onResetPercentage: any;
  onInvert: any;
}

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
    this.props.onInvert(this.isInverted);
  };

  reset = () => {
    this.setState({
      action: this.props.action
    });
    this.isInverted = false;
    this.updateInvertedValues(null);
    this.props.onReset();
  };

  handlePercentageChange = (index?: number) => () => {
    this.props.onHandlePercentageChange(index)(this.isInverted);
  };

  render() {
    const {baseAssetName, quoteAssetName} = this.props;
    this.previousPropsAction = this.props.action;
    const {quantityAccuracy, priceAccuracy, quantity} = this.props;
    const currentAccuracy = this.isInverted ? priceAccuracy : quantityAccuracy;

    return (
      <div>
        <div>
          <div>
            <div>
              <Flex justify="space-between">
                <Action>
                  {this.state.action}{' '}
                  {!this.isInverted ? baseAssetName : quoteAssetName}
                </Action>
                <Amount onClick={this.handlePercentageChange()}>
                  {this.props.balance}{' '}
                  {this.props.isSell ? baseAssetName : quoteAssetName} available
                </Amount>
              </Flex>
            </div>
          </div>
          <Flex>
            <InputControl style={{width: '100%'}}>
              <NumberInput
                value={quantity}
                id={OrderInputs.Quantity}
                onChange={this.props.onChange(currentAccuracy)}
                onArrowClick={this.props.onArrowClick(currentAccuracy)}
              />
            </InputControl>
          </Flex>
          <div>
            <Flex justify={'space-between'} style={{width: '100%'}}>
              {this.props.percents!.map((item: any, index: number) => (
                <OrderPercentage
                  percent={item.percent}
                  key={index}
                  onClick={this.handlePercentageChange(index)}
                  isActive={item.isActive}
                  isDisabled={!this.props.balance}
                />
              ))}
            </Flex>
          </div>
        </div>
        <MarketConfirmButton>
          <OrderButton
            isDisable={this.props.isDisable}
            type={'submit'}
            message={`${capitalize(this.state.action)} ${quantity} ${
              !this.isInverted ? baseAssetName : quoteAssetName
            }`}
          />
        </MarketConfirmButton>
        <Reset justify={'center'}>
          <span onClick={this.reset}>Reset and clear</span>
        </Reset>
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
      baseAssetName,
      quoteAssetName,
      quantityAccuracy,
      priceAccuracy
    } = props;
    const {invertedAction, isInverted} = values;
    props.onSubmit(
      invertedAction || action,
      isInverted ? quoteAssetName : baseAssetName,
      isInverted ? baseAssetName : quoteAssetName,
      isInverted ? priceAccuracy : quantityAccuracy
    );
  }
})(OrderMarketForm);
