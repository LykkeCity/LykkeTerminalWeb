import {rem} from 'polished';
import {pathOr} from 'rambda';
import * as React from 'react';
import styled from 'styled-components';
import orderAction from '../../constants/orderAction';
import keys from '../../constants/storageKeys';
import {OrderInputs, OrderType} from '../../models';
import InstrumentModel from '../../models/instrumentModel';
import Types from '../../models/modals';
import {StorageUtils} from '../../utils/index';
import {OrderProps, OrderState} from './index';
import OrderActionButton from './OrderActionButton';
import OrderChoiceButton from './OrderChoiceButton';
import OrderLimit from './OrderLimit';
import OrderMarket from './OrderMarket';

const confirmStorage = StorageUtils(keys.confirmReminder);

const percentage = [
  {
    isActive: false,
    percent: 25
  },
  {
    isActive: false,
    percent: 50
  },
  {
    isActive: false,
    percent: 75
  },
  {
    isActive: false,
    percent: 100
  }
];

const MARKET = OrderType.Market;
const LIMIT = OrderType.Limit;
const STOP_LIMIT = OrderType.StopLimit;

const StyledMarkets = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${rem(16)};
`;

const StyledActions = StyledMarkets.extend`
  justify-content: center;
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

  initPriceUpdate = (price: number, instrument: InstrumentModel) => {
    const priceAccuracy = pathOr(2, ['accuracy'], instrument);
    this.setState({
      priceValue: price.toFixed(priceAccuracy)
    });
  };

  handleChangeInstrument = (instrument: InstrumentModel) => {
    const priceAccuracy = pathOr(2, ['accuracy'], instrument);
    const asset = this.props.getAssetById(
      pathOr('', ['name'], instrument).split('/')[0]
    );
    const quantityAccuracy = asset ? asset.accuracy : 2;
    const price = instrument.price ? instrument.price : 0;
    this.setState({
      priceValue: price.toFixed(priceAccuracy),
      quantityValue: parseFloat('0').toFixed(quantityAccuracy)
    });
  };

  handleActionClick = (action: string) => () => {
    this.resetPercentage();
    this.setState({
      isSellActive: action === orderAction.sell.action,
      percents: percentage
    });
  };

  resetPercentage = () => {
    percentage.forEach((item: any) => {
      item.isActive = false;
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
    this.resetPercentage();
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

  applyOrder = (
    action: string,
    quantity: string,
    baseName: string,
    price: string
  ) => {
    const orderType = this.state.isMarketActive ? MARKET : LIMIT;
    const body: any = {
      AssetId: baseName,
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

  handleButtonClick = (action: string, baseName: string, quoteName: string) => {
    this.disableButton(true);
    const {quantityValue, priceValue} = this.state;
    const currentPrice = parseFloat(priceValue).toFixed(
      this.props.accuracy.priceAccuracy
    );

    const isConfirm = confirmStorage.get() as string;
    if (!JSON.parse(isConfirm)) {
      return this.applyOrder(action, quantityValue, baseName, currentPrice);
    }
    const messageSuffix = this.state.isMarketActive
      ? 'at the market price'
      : `at the price of ${currentPrice} ${quoteName}`;
    const message = `${action} ${quantityValue} ${baseName} ${messageSuffix}`;
    this.props.addModal(
      message,
      () => this.applyOrder(action, quantityValue, baseName, currentPrice),
      this.cancelOrder,
      Types.Confirm
    );
  };

  updatePercentageState = (field: string) => {
    const {isLimitActive, isSellActive, isMarketActive} = this.state;
    const tempObj: any = {};
    if (isLimitActive && isSellActive && field === OrderInputs.Quantity) {
      this.resetPercentage();
      tempObj.percents = percentage;
    } else if (isLimitActive && !isSellActive && field === OrderInputs.Price) {
      this.resetPercentage();
      tempObj.percents = percentage;
    } else if (isMarketActive) {
      this.resetPercentage();
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

  getPartlyValue = (percent: number, balance: number, accuracy: number) => {
    return (percent / 100 * balance).toFixed(accuracy);
  };

  handlePercentageChange = (index: number) => async (isInverted?: boolean) => {
    let value: number = 0;
    const {
      baseAssetBalance,
      quoteAssetBalance,
      accuracy,
      baseName,
      quoteName
    } = this.props;
    percentage.forEach((item: any, i: number) => {
      if (index === i) {
        item.isActive = true;
        value = item.percent;
      } else {
        item.isActive = false;
      }
    });
    const tempObj: any = {};
    if (this.state.isLimitActive) {
      if (this.state.isSellActive) {
        tempObj.quantityValue = this.getPartlyValue(
          value,
          baseAssetBalance,
          accuracy.quantityAccuracy
        );
      } else if (!this.state.isSellActive) {
        tempObj.priceValue = this.getPartlyValue(
          value,
          quoteAssetBalance,
          accuracy.priceAccuracy
        );
      }
    } else if (this.state.isMarketActive) {
      if (this.state.isSellActive) {
        if (!isInverted) {
          tempObj.quantityValue = this.getPartlyValue(
            value,
            baseAssetBalance,
            accuracy.quantityAccuracy
          );
        } else {
          const convertedBalance = await this.props.convertPartiallyBalance(
            baseAssetBalance,
            baseName,
            quoteName
          );
          tempObj.quantityValue = this.getPartlyValue(
            value,
            convertedBalance,
            accuracy.quantityAccuracy
          );
        }
      } else {
        if (isInverted) {
          tempObj.quantityValue = this.getPartlyValue(
            value,
            quoteAssetBalance,
            accuracy.quantityAccuracy
          );
        } else {
          const convertedBalance = await this.props.convertPartiallyBalance(
            quoteAssetBalance,
            quoteName,
            baseName
          );
          tempObj.quantityValue = this.getPartlyValue(
            value,
            convertedBalance,
            accuracy.quantityAccuracy
          );
        }
      }
    }
    tempObj.percents = percentage;
    this.setState(tempObj);
  };

  isLimitDisable = () => {
    return !+this.state.priceValue || !+this.state.quantityValue;
  };

  isMarketDisable = () => {
    return !+this.state.quantityValue;
  };

  reset = () => {
    this.resetPercentage();
    this.setState({
      percents: percentage,
      priceValue: this.props.bid.toFixed(this.props.accuracy.priceAccuracy),
      quantityValue: '0'
    });
  };

  render() {
    const {action} = this.state.isSellActive
      ? orderAction.sell
      : orderAction.buy;
    const currentPrice =
      (this.state.isMarketActive
        ? this.state.isSellActive ? this.props.bid : this.props.ask
        : parseFloat(this.state.priceValue)) || 0;

    const available = this.state.isSellActive
      ? this.props.baseAssetBalance
      : this.props.quoteAssetBalance;

    return (
      <div>
        <StyledMarkets>
          <OrderChoiceButton
            title={LIMIT}
            isActive={this.state.isLimitActive}
            click={this.handleActionChoiceClick(LIMIT)}
          />
          <OrderChoiceButton
            title={MARKET}
            isActive={this.state.isMarketActive}
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
            isActive={this.state.isSellActive}
          />
          <OrderActionButton
            title={orderAction.buy.action}
            click={this.handleActionClick(orderAction.buy.action)}
            isActive={!this.state.isSellActive}
          />
        </StyledActions>

        {this.state.isLimitActive && (
          <OrderLimit
            action={action}
            onSubmit={this.handleButtonClick}
            quantity={this.state.quantityValue}
            price={this.state.priceValue}
            quantityAccuracy={this.props.accuracy.quantityAccuracy}
            priceAccuracy={this.props.accuracy.priceAccuracy}
            onChange={this.onChange}
            onArrowClick={this.onArrowClick}
            percents={this.state.percents}
            onHandlePercentageChange={this.handlePercentageChange}
            baseName={this.props.baseName}
            quoteName={this.props.quoteName}
            isSell={this.state.isSellActive}
            amount={this.props.fixedAmount(
              currentPrice,
              this.state.quantityValue,
              this.props.accuracy.priceAccuracy
            )}
            isDisable={this.isLimitDisable()}
            onReset={this.reset}
            balance={
              available &&
              available.toFixed(this.props.accuracy.quantityAccuracy)
            }
          />
        )}

        {this.state.isMarketActive && (
          <OrderMarket
            quantityAccuracy={this.props.accuracy.quantityAccuracy}
            action={action}
            quantity={this.state.quantityValue}
            baseName={this.props.baseName}
            quoteName={this.props.quoteName}
            percents={this.state.percents}
            onHandlePercentageChange={this.handlePercentageChange}
            onChange={this.onChange}
            onArrowClick={this.onArrowClick}
            onReset={this.reset}
            isDisable={this.isMarketDisable()}
            onSubmit={this.handleButtonClick}
            balance={
              available &&
              available.toFixed(this.props.accuracy.quantityAccuracy)
            }
            isSell={this.state.isSellActive}
            onResetPercentage={this.resetPercentage}
          />
        )}

        {/*{this.state.isStopLimitActive && (*/}
        {/*<OrderStopLimit*/}
        {/*/>*/}
        {/*)}*/}

        {/*<div>*/}
        {/*<OrderForm*/}
        {/*assetName={this.props.name}*/}
        {/*isMarket={this.state.isMarketActive}*/}
        {/*isDisable={this.state.pendingOrder || this.isInvalidValues()}*/}
        {/*action={action}*/}
        {/*onSubmit={this.handleButtonClick}*/}
        {/*onChange={this.onChange}*/}
        {/*onArrowClick={this.onArrowClick}*/}
        {/*amount={this.props.fixedAmount(*/}
        {/*currentPrice,*/}
        {/*this.state.quantityValue,*/}
        {/*this.props.accuracy.priceValue*/}
        {/*)}*/}
        {/*quantity={this.state.quantityValue}*/}
        {/*price={this.state.priceValue}*/}
        {/*buy={this.state.buyValue}*/}
        {/*sell={this.state.sellValue}*/}
        {/*quantityAccuracy={this.props.accuracy.quantityValue}*/}
        {/*priceAccuracy={this.props.accuracy.priceValue}*/}
        {/*/>*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default Order;
