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
  StyledAvailable,
  StyledInputControl,
  StyledReset
} from './index';
import OrderButton from './OrderButton';
import OrderPercentage from './OrderPercentage';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledOrderButton = styled.div`
  margin-top: ${rem(24)};
`;

// const StyledInvertedTitle = Box.extend`
//   font-size: ${rem(14)};
//   opacity: 0.4;
//
//   &:first-letter {
//     text-transform: capitalize;
//   }
// `;
//
// const StyledInvertedBtn = Box.extend`
//   background: url('assets/images/invert.png') no-repeat center;
//   border: 1px solid rgba(140, 148, 160, 0.4);
//   border-radius: 4px;
//   width: 32px;
//   height: 32px;
//   margin: 0 8px;
//
//   &:hover {
//     cursor: pointer;
//   }
// `;

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

  handlePercentageChange = (index: number) => () => {
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
                <StyledActionTitle>
                  {this.state.action}{' '}
                  {!this.isInverted ? baseAssetName : quoteAssetName}
                </StyledActionTitle>
                <StyledAvailable
                  onClick={this.handlePercentageChange(
                    this.props.percents.length - 1
                  )}
                >
                  {this.props.balance}{' '}
                  {this.props.isSell ? baseAssetName : quoteAssetName} available
                </StyledAvailable>
              </Flex>
            </div>
          </div>
          <Flex>
            <StyledInputControl style={{width: '100%'}}>
              <NumberInput
                value={quantity}
                id={OrderInputs.Quantity}
                onChange={this.props.onChange(currentAccuracy)}
                onArrowClick={this.props.onArrowClick(currentAccuracy)}
              />
            </StyledInputControl>
            {/*<Flex align={'center'}>*/}
            {/*<StyledInvertedBtn onClick={this.onInvert} />*/}
            {/*<StyledInvertedTitle>*/}
            {/*{this.state.action === orderAction.sell.action*/}
            {/*? orderAction.buy.action*/}
            {/*: orderAction.sell.action}{' '}*/}
            {/*{this.isInverted ? baseAssetName : quoteAssetName}*/}
            {/*</StyledInvertedTitle>*/}
            {/*</Flex>*/}
          </Flex>
          <div>
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
            isDisable={this.props.isDisable}
            type={'submit'}
            message={`${capitalize(this.state.action)} ${quantity} ${
              !this.isInverted ? baseAssetName : quoteAssetName
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
