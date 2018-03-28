import {rem} from 'polished';
import {pathOr} from 'rambda';
import * as React from 'react';
import styled from 'styled-components';
import orderAction from '../../constants/orderAction';
import {Percentage} from '../../constants/ordersPercentage';
import keys from '../../constants/storageKeys';
import {OrderInputs, OrderType} from '../../models';
import InstrumentModel from '../../models/instrumentModel';
import Types from '../../models/modals';
import {capitalize} from '../../utils';
import {StorageUtils} from '../../utils/index';
import {OrderProps, OrderState} from './index';
import OrderActionButton from './OrderActionButton';
import OrderChoiceButton from './OrderChoiceButton';
import OrderLimit from './OrderLimit';
import OrderMarket from './OrderMarket';

const confirmStorage = StorageUtils(keys.confirmReminder);

const percentage = Percentage.map((i: any) => {
  return {...i};
});

const MARKET = OrderType.Market;
const LIMIT = OrderType.Limit;
const STOP_LIMIT = OrderType.StopLimit;

const StyledMarkets = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${rem(16)};
  border-bottom: 1px solid #2d2d2d;
`;

const StyledActions = StyledMarkets.extend`
  justify-content: center;
  border-bottom: none;
`;

class Order extends React.Component<OrderProps, OrderState> {
  constructor(props: OrderProps) {
    super(props);
    this.state = {
      isLimitActive: true,
      isMarketActive: false,
      isSellActive: true,
      isStopLimitActive: false,
      pendingOrder: false,
      percents: percentage,
      priceValue: '0',
      quantityValue: '0'
    };

    this.props.stateFns.push(this.handleChangeInstrument);
    this.props.updatePriceFn(this.updatePriceByOrderBook);
    this.props.updateDepthFn(this.updateDepthByOrderBook);
    this.props.initPriceFn(this.initPriceUpdate);
  }

  initPriceUpdate = (price: number = 0, instrument: InstrumentModel) => {
    const priceAccuracy = pathOr(2, ['accuracy'], instrument);
    this.setState({
      priceValue: price.toFixed(priceAccuracy)
    });
  };

  handleChangeInstrument = (instrument: InstrumentModel) => {
    const priceAccuracy = pathOr(2, ['accuracy'], instrument);
    const asset = this.props.getAssetById(
      pathOr('', ['baseAsset', 'id'], instrument)
    );
    const quantityAccuracy = asset ? asset.accuracy : 2;
    this.setState({
      priceValue: this.props.mid.toFixed(priceAccuracy),
      quantityValue: parseFloat('0').toFixed(quantityAccuracy)
    });
  };

  handleActionClick = (action: string) => () => {
    this.props.resetPercentage(percentage);
    this.setState({
      isSellActive: action === orderAction.sell.action,
      percents: percentage
    });
  };

  updatePriceByOrderBook = (price: number) => {
    this.setState({
      priceValue: price.toFixed(this.props.accuracy.priceAccuracy)
    });
  };

  updateDepthByOrderBook = (quantity: number) => {
    this.setState({
      quantityValue: quantity.toFixed(this.props.accuracy.quantityAccuracy)
    });
  };

  handleActionChoiceClick = (choice: string) => () => {
    this.reset();
    this.setState({
      isLimitActive: choice === LIMIT,
      isMarketActive: choice === MARKET,
      isStopLimitActive: choice === STOP_LIMIT,
      percents: percentage
    });
  };

  disableButton = (value: boolean) => {
    this.setState({
      pendingOrder: value
    });
  };

  handleInvert = (isInverted: boolean) => {
    const {quantityValue} = this.state;
    const {accuracy: {priceAccuracy, quantityAccuracy}} = this.props;
    this.setState({
      quantityValue: isInverted
        ? parseFloat(quantityValue).toFixed(priceAccuracy)
        : parseFloat(quantityValue).toFixed(quantityAccuracy)
    });
  };

  applyOrder = (
    action: string,
    quantity: string,
    baseAssetId: string,
    price: string
  ) => {
    const orderType = this.state.isMarketActive ? MARKET : LIMIT;
    const body: any = {
      AssetId: baseAssetId,
      AssetPairId: this.props.currency,
      OrderAction: action,
      Volume: parseFloat(quantity)
    };

    if (!this.state.isMarketActive) {
      body.Price = parseFloat(price);
    }

    this.props
      .placeOrder(orderType, body)
      .then(() => this.disableButton(false))
      .catch(() => this.disableButton(false));
  };

  cancelOrder = () => {
    this.disableButton(false);
  };

  handleButtonClick = (
    action: string,
    baseAssetName: string,
    quoteAssetName: string,
    accuracy?: number
  ) => {
    this.disableButton(true);
    const {quantityValue, priceValue} = this.state;
    const currentPrice = parseFloat(priceValue).toFixed(
      this.props.accuracy.priceAccuracy
    );

    const currentQuantity = accuracy
      ? parseFloat(quantityValue).toFixed(accuracy)
      : quantityValue;

    const isConfirm = confirmStorage.get() as string;
    if (!JSON.parse(isConfirm)) {
      return this.applyOrder(
        action,
        currentQuantity,
        this.props.baseAssetId,
        currentPrice
      ); // TODO baseAssetId should be passed from component for inverted case
    }
    const messageSuffix = this.state.isMarketActive
      ? 'at the market price'
      : `at the price of ${currentPrice} ${quoteAssetName}`;
    const message = `${action} ${currentQuantity} ${baseAssetName} ${messageSuffix}`;
    this.props.addModal(
      message,
      () =>
        this.applyOrder(
          action,
          currentQuantity,
          this.props.baseAssetId,
          currentPrice
        ), // TODO baseAssetId should be passed from component for inverted case
      this.cancelOrder,
      Types.Confirm
    );
  };

  updatePercentageState = (field: string) => {
    const {isLimitActive, isSellActive, isMarketActive} = this.state;
    const tempObj: any = {};
    if (isLimitActive && isSellActive && field === OrderInputs.Quantity) {
      this.props.resetPercentage(percentage);
      tempObj.percents = percentage;
    } else if (isLimitActive && !isSellActive && field === OrderInputs.Price) {
      this.props.resetPercentage(percentage);
      tempObj.percents = percentage;
    } else if (isMarketActive) {
      this.props.resetPercentage(percentage);
      tempObj.percents = percentage;
    }
    this.setState(tempObj);
  };

  onArrowClick = (accuracy: number) => (
    operation: string,
    field: string
  ) => () => {
    const tempObj = this.props.onArrowClick({
      accuracy,
      field,
      operation,
      value: this.state[field]
    });
    this.updatePercentageState(field);
    this.setState(tempObj);
  };

  onChange = (accuracy: number) => (field: string) => (e: any) => {
    const tempObj = this.props.onValueChange({
      accuracy,
      field,
      value: e.target.value
    });

    this.updatePercentageState(field);
    this.setState(tempObj);
  };

  handlePercentageChange = (index: number) => async (isInverted?: boolean) => {
    const {
      baseAssetBalance,
      quoteAssetBalance,
      accuracy: {quantityAccuracy, priceAccuracy},
      baseAssetId,
      quoteAssetId
    } = this.props;
    const {isLimitActive, isSellActive, isMarketActive} = this.state;

    const tempObj = await this.props.handlePercentageChange({
      balance: this.state.isSellActive ? baseAssetBalance : quoteAssetBalance,
      baseAssetId,
      index,
      isInverted,
      isLimitActive,
      isMarketActive,
      isSellActive,
      percentage,
      priceAccuracy,
      quantityAccuracy,
      quoteAssetId
    });

    this.setState(tempObj);
  };

  isLimitDisable = () => {
    return !+this.state.priceValue || !+this.state.quantityValue;
  };

  isMarketDisable = () => {
    return !+this.state.quantityValue;
  };

  reset = () => {
    const {priceAccuracy, quantityAccuracy} = this.props.accuracy;
    this.props.resetPercentage(percentage);
    this.setState({
      percents: percentage,
      priceValue: this.props.mid.toFixed(priceAccuracy),
      quantityValue: parseFloat('0').toFixed(quantityAccuracy)
    });
  };

  render() {
    const {
      baseAssetBalance,
      quoteAssetBalance,
      accuracy: {quantityAccuracy, priceAccuracy},
      baseAssetName,
      quoteAssetName,
      fixedAmount,
      bid,
      ask,
      resetPercentage
    } = this.props;
    const {
      isSellActive,
      isMarketActive,
      priceValue,
      isLimitActive,
      quantityValue,
      percents
    } = this.state;
    const {action} = isSellActive ? orderAction.sell : orderAction.buy;
    const currentPrice =
      (isMarketActive ? (isSellActive ? bid : ask) : parseFloat(priceValue)) ||
      0;

    const available = isSellActive ? baseAssetBalance : quoteAssetBalance;

    const balanceAccuracy = isSellActive ? quantityAccuracy : priceAccuracy;

    return (
      <div>
        <StyledMarkets>
          <OrderChoiceButton
            title={LIMIT}
            isActive={isLimitActive}
            click={this.handleActionChoiceClick(LIMIT)}
          />
          <OrderChoiceButton
            title={MARKET}
            isActive={isMarketActive}
            click={this.handleActionChoiceClick(MARKET)}
          />
          {/*<OrderChoiceButton*/}
          {/*title={STOP_LIMIT}*/}
          {/*isActive={this.state.isStopLimitActive}*/}
          {/*click={this.handleActionChoiceClick(STOP_LIMIT)}*/}
          {/*/>*/}
        </StyledMarkets>

        <StyledActions>
          <OrderActionButton
            title={orderAction.sell.action}
            click={this.handleActionClick(orderAction.sell.action)}
            isActive={isSellActive}
          />
          <OrderActionButton
            title={orderAction.buy.action}
            click={this.handleActionClick(orderAction.buy.action)}
            isActive={!isSellActive}
          />
        </StyledActions>

        {isLimitActive && (
          <OrderLimit
            action={action}
            onSubmit={this.handleButtonClick}
            quantity={quantityValue}
            price={priceValue}
            quantityAccuracy={quantityAccuracy}
            priceAccuracy={priceAccuracy}
            onChange={this.onChange}
            onArrowClick={this.onArrowClick}
            percents={percents}
            onHandlePercentageChange={this.handlePercentageChange}
            baseAssetName={baseAssetName}
            quoteAssetName={quoteAssetName}
            isSell={isSellActive}
            amount={fixedAmount(currentPrice, quantityValue, priceAccuracy)}
            isDisable={this.isLimitDisable()}
            onReset={this.reset}
            balance={available && available.toFixed(balanceAccuracy)}
            buttonMessage={`${capitalize(
              action
            )} ${quantityValue} ${baseAssetName}`}
          />
        )}

        {isMarketActive && (
          <OrderMarket
            quantityAccuracy={quantityAccuracy}
            action={action}
            quantity={quantityValue}
            baseAssetName={baseAssetName}
            quoteAssetName={quoteAssetName}
            percents={percents}
            onHandlePercentageChange={this.handlePercentageChange}
            onChange={this.onChange}
            onArrowClick={this.onArrowClick}
            onReset={this.reset}
            isDisable={this.isMarketDisable()}
            onSubmit={this.handleButtonClick}
            balance={available && available.toFixed(balanceAccuracy)}
            isSell={isSellActive}
            // tslint:disable-next-line:jsx-no-lambda
            onResetPercentage={() => resetPercentage(percentage)}
            priceAccuracy={priceAccuracy}
            onInvert={this.handleInvert}
          />
        )}

        {/*{this.state.isStopLimitActive && (*/}
        {/*<OrderStopLimit*/}
        {/*/>*/}
        {/*)}*/}

        {/*<StyledNote>*/}
        {/*Your order may execute as a maker order or taker order.*/}
        {/*</StyledNote>*/}
      </div>
    );
  }
}

export default Order;
