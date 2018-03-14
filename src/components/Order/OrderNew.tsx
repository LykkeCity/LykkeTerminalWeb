import {rem} from 'polished';
import {pathOr} from 'rambda';
import * as React from 'react';
import styled from 'styled-components';
import orderAction from '../../constants/orderAction';
import keys from '../../constants/storageKeys';
import InstrumentModel from '../../models/instrumentModel';
import Types from '../../models/modals';
import OrderType from '../../models/orderType';
import MarketService from '../../services/marketService';
import {StorageUtils} from '../../utils/index';
import {OrderProps, OrderState} from './index';
import OrderActionButton from './OrderActionButton';
import OrderChoiceButton from './OrderChoiceButton';
// import {default as OrderForm} from './OrderForm';
import OrderLimit from './OrderLimit';
import OrderMarket from './OrderMarket';
import OrderStopLimit from './OrderStopLimit';

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
    this.setState({
      isLimitActive: choice === LIMIT,
      isMarketActive: choice === MARKET,
      isStopLimitActive: choice === STOP_LIMIT
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

  handleButtonClick = (action: string) => {
    this.disableButton(true);
    const baseName = this.props.name.split('/')[0];
    const quoteName = this.props.name.split('/')[1];
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
    if (this.state.isLimitActive && field === 'quantityValue') {
      this.resetPercentage();
      tempObj.percents = percentage;
    }
    this.setState(tempObj);
  };

  onChange = (accuracy: number) => (field: string) => (e: any) => {
    const tempObj = this.props.onValueChange({
      accuracy,
      field,
      value: e.target.value
    });

    if (this.state.isLimitActive && field === 'quantityValue') {
      this.resetPercentage();
      tempObj.percents = percentage;
    }
    this.setState(tempObj);
  };

  handlePercentageChange = (index: number) => async (isInverted?: boolean) => {
    let value: number = 0;
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
        tempObj.quantityValue = (
          value /
          100 *
          this.props.baseAssetBalance
        ).toFixed(this.props.accuracy.quantityAccuracy);
      } else if (!this.state.isSellActive) {
        tempObj.priceValue = (
          value /
          100 *
          this.props.quoteAssetBalance
        ).toFixed(this.props.accuracy.priceAccuracy);
      }
    } else if (this.state.isMarketActive) {
      if (this.state.isSellActive) {
        if (!isInverted) {
          tempObj.quantityValue = (
            value /
            100 *
            this.props.baseAssetBalance
          ).toFixed(this.props.accuracy.quantityAccuracy);
        } else {
          const convertedQuoteAsset = await MarketService.convert(
            [
              {
                AssetId: this.props.name.split('/')[0],
                Balance: this.props.baseAssetBalance
              }
            ],
            this.props.name.split('/')[1]
          );
          tempObj.quantityValue = (
            value /
            100 *
            convertedQuoteAsset[0].Balance
          ).toFixed(this.props.accuracy.quantityAccuracy);
        }
      } else {
        tempObj.quantityValue = (
          value /
          100 *
          this.props.quoteAssetBalance
        ).toFixed(this.props.accuracy.quantityAccuracy);
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

  isLimitDisable = () => {
    return !+this.state.priceValue || !+this.state.quantityValue;
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
          <OrderChoiceButton
            title={STOP_LIMIT}
            isActive={this.state.isStopLimitActive}
            click={this.handleActionChoiceClick(STOP_LIMIT)}
          />
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
            quantityAccuracy={this.props.accuracy.quantityValue}
            priceAccuracy={this.props.accuracy.priceValue}
            onChange={this.onChange}
            onArrowClick={this.onArrowClick}
            percents={this.state.percents}
            onHandlePercentageChange={this.handlePercentageChange}
            assetName={this.props.name}
            isSell={this.state.isSellActive}
            amount={this.props.fixedAmount(
              currentPrice,
              this.state.quantityValue,
              this.props.accuracy.priceAccuracy
            )}
            isDisable={this.isLimitDisable()}
          />
        )}

        {this.state.isMarketActive && <OrderMarket />}

        {this.state.isStopLimitActive && <OrderStopLimit />}

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
