import * as React from 'react';
import orderAction from '../../constants/orderAction';
import {Percentage} from '../../constants/ordersPercentage';
import {keys} from '../../models';
import {OrderInputs, OrderType} from '../../models';
import InstrumentModel from '../../models/instrumentModel';
import Types from '../../models/modals';
import {capitalize} from '../../utils';
import {StorageUtils} from '../../utils/index';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {precisionFloor} from '../../utils/math';
import ActionChoiceButton from './ActionChoiceButton';
import MarketChoiceButton from './MarketChoiceButton';
import OrderLimit from './OrderLimit';
import OrderMarket from './OrderMarket';
import {Actions, Markets} from './styles';

const confirmStorage = StorageUtils(keys.confirmReminder);

const percentage = Percentage.map((i: any) => {
  return {...i};
});

const MARKET = OrderType.Market;
const LIMIT = OrderType.Limit;
const STOP_LIMIT = OrderType.StopLimit;

interface OrderState {
  isMarketActive: boolean;
  isLimitActive: boolean;
  isStopLimitActive: boolean;
  isSellActive: boolean;
  pendingOrder: boolean;
  percents: any[];
}

interface OrderProps {
  addModal: any;
  ask: number;
  bid: number;
  accuracy: {
    priceAccuracy: number;
    quantityAccuracy: number;
    baseAssetAccuracy: number;
    quoteAssetAccuracy: number;
  };
  currency: string;
  placeOrder: any;
  baseAssetName: string;
  quoteAssetName: string;
  getAssetById: any;
  onValueChange: any;
  orderState: any;
  updateSideFn: any;
  updateTypeFn: any;
  baseAssetBalance: any;
  quoteAssetBalance: any;
  convertPartiallyBalance: any;
  mid: number;
  handlePercentageChange: any;
  setActivePercentage: (
    percentage: any[],
    index?: number
  ) => {value: number; updatedPercentage: any[]};
  updatePercentageState: any;
  resetPercentage: any;
  baseAssetId: string;
  quoteAssetId: string;
  isLimitInvalid: (
    isSell: boolean,
    quantityValue: string,
    priceValue: string,
    baseAssetBalance: number,
    quoteAssetBalance: number,
    priceAccuracy: number,
    quantityAccuracy: number
  ) => boolean;
  isMarketInvalid: (
    isSell: boolean,
    quantityValue: string,
    baseAssetId: string,
    quoteAssetId: string,
    baseAssetBalance: number,
    quoteAssetBalance: number,
    quantityAccuracy: number
  ) => boolean;
  instrument: InstrumentModel;
  priceValue: string;
  quantityValue: string;
  onPriceArrowClick: (operation: string) => void;
  onQuantityArrowClick: (operation: string) => void;
  onPriceChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  setPriceValue: (value: number) => void;
  setQuantityValue: (value: number) => void;
}

class Order extends React.Component<OrderProps, OrderState> {
  constructor(props: OrderProps) {
    super(props);
    this.state = {
      isLimitActive: true,
      isMarketActive: false,
      isSellActive: true,
      isStopLimitActive: false,
      pendingOrder: false,
      percents: percentage
    };

    this.props.updateSideFn(this.updateSideByOrderBook);
    this.props.updateTypeFn(this.updateTypeByOrderBook);
  }

  componentDidMount() {
    // this.handleChangeInstrument(this.props.instrument); // TODO check session logic
  }

  handleActionClick = (action: string) => () => {
    this.props.resetPercentage(percentage);
    this.setState({
      isSellActive: action === orderAction.sell.action,
      percents: percentage
    });
  };

  updateSideByOrderBook = (isSell: boolean) => {
    this.setState({
      isSellActive: isSell
    });
  };

  updateTypeByOrderBook = (isLimit: boolean) => {
    this.setState({
      isMarketActive: !isLimit,
      isLimitActive: isLimit
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
    quoteAssetName: string
  ) => {
    this.disableButton(true);
    const {quantityValue, priceValue} = this.props;
    const displayedPrice = formattedNumber(
      +parseFloat(priceValue),
      this.props.accuracy.priceAccuracy
    );

    const displayedQuantity = formattedNumber(
      +parseFloat(quantityValue),
      this.props.accuracy.baseAssetAccuracy
    );

    const isConfirm = confirmStorage.get() as string;
    if (!JSON.parse(isConfirm)) {
      return this.applyOrder(
        action,
        quantityValue,
        this.props.baseAssetId,
        priceValue
      ); // TODO baseAssetId should be passed from component for inverted case
    }
    const messageSuffix = this.state.isMarketActive
      ? 'at the market price'
      : `at the price of ${displayedPrice} ${quoteAssetName}`;
    const message = `${action} ${displayedQuantity} ${baseAssetName} ${messageSuffix}`;
    this.props.addModal(
      message,
      () =>
        this.applyOrder(
          action,
          quantityValue,
          this.props.baseAssetId,
          priceValue
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

  handlePercentageChange = (index?: number) => async (isInverted?: boolean) => {
    const {
      baseAssetBalance,
      quoteAssetBalance,
      accuracy: {quantityAccuracy, priceAccuracy},
      baseAssetId,
      quoteAssetId,
      priceValue
    } = this.props;
    const {isLimitActive, isSellActive, isMarketActive} = this.state;
    const balance = this.state.isSellActive
      ? baseAssetBalance
      : quoteAssetBalance;

    if (!balance) {
      return;
    }

    const {updatedPercentage, value} = this.props.setActivePercentage(
      percentage,
      index
    );

    const tempObj = await this.props.handlePercentageChange({
      balance,
      baseAssetId,
      index,
      isInverted,
      isLimitActive,
      isMarketActive,
      isSellActive,
      priceAccuracy,
      quantityAccuracy,
      quoteAssetId,
      value,
      currentPrice: priceValue
    });

    tempObj.percents = updatedPercentage;

    this.setState(tempObj);
  };

  reset = () => {
    const {setPriceValue, setQuantityValue, resetPercentage} = this.props;
    resetPercentage(percentage);
    setPriceValue(this.props.mid);
    setQuantityValue(0);
    this.setState({
      percents: percentage
    });
  };

  render() {
    const {
      baseAssetBalance,
      quoteAssetBalance,
      accuracy: {
        quantityAccuracy,
        priceAccuracy,
        quoteAssetAccuracy,
        baseAssetAccuracy
      },
      baseAssetName,
      quoteAssetName,
      bid,
      ask,
      resetPercentage,
      baseAssetId,
      quoteAssetId,
      priceValue,
      quantityValue
    } = this.props;
    const {isSellActive, isMarketActive, isLimitActive, percents} = this.state;
    const {action} = isSellActive ? orderAction.sell : orderAction.buy;
    const currentPrice =
      (isMarketActive ? (isSellActive ? bid : ask) : parseFloat(priceValue)) ||
      0;

    const isLimitInvalid =
      this.state.pendingOrder ||
      this.props.isLimitInvalid(
        isSellActive,
        quantityValue,
        priceValue,
        baseAssetBalance,
        quoteAssetBalance,
        priceAccuracy,
        quantityAccuracy
      );

    const isMarketInvalid =
      this.state.pendingOrder ||
      this.props.isMarketInvalid(
        isSellActive,
        quantityValue,
        baseAssetId,
        quoteAssetId,
        baseAssetBalance,
        quoteAssetBalance,
        quantityAccuracy
      );

    const available = isSellActive ? baseAssetBalance : quoteAssetBalance;

    const balanceAccuracy = isSellActive
      ? baseAssetAccuracy
      : quoteAssetAccuracy;

    const roundedAmount = precisionFloor(
      currentPrice * parseFloat(quantityValue),
      quoteAssetAccuracy
    );

    return (
      <div>
        <Markets>
          <MarketChoiceButton
            title={LIMIT}
            isActive={isLimitActive}
            click={this.handleActionChoiceClick(LIMIT)}
          />
          <MarketChoiceButton
            title={MARKET}
            isActive={isMarketActive}
            click={this.handleActionChoiceClick(MARKET)}
          />
        </Markets>

        <Actions>
          <ActionChoiceButton
            title={orderAction.sell.action}
            click={this.handleActionClick(orderAction.sell.action)}
            isActive={isSellActive}
          />
          <ActionChoiceButton
            title={orderAction.buy.action}
            click={this.handleActionClick(orderAction.buy.action)}
            isActive={!isSellActive}
          />
        </Actions>

        {isLimitActive && (
          <OrderLimit
            action={action}
            onSubmit={this.handleButtonClick}
            quantity={this.props.quantityValue}
            price={this.props.priceValue}
            quantityAccuracy={quantityAccuracy}
            priceAccuracy={priceAccuracy}
            onPriceChange={this.props.onPriceChange}
            onQuantityChange={this.props.onQuantityChange}
            onPriceArrowClick={this.props.onPriceArrowClick}
            onQuantityArrowClick={this.props.onQuantityArrowClick}
            baseAssetAccuracy={baseAssetAccuracy}
            percents={percents}
            onHandlePercentageChange={this.handlePercentageChange}
            baseAssetName={baseAssetName}
            quoteAssetName={quoteAssetName}
            isSell={isSellActive}
            amount={formattedNumber(roundedAmount || 0, quoteAssetAccuracy)}
            isDisable={isLimitInvalid}
            onReset={this.reset}
            balance={available}
            buttonMessage={`${capitalize(action)} ${formattedNumber(
              +quantityValue,
              quantityAccuracy
            )} ${baseAssetName}`}
            balanceAccuracy={balanceAccuracy}
            updatePercentageState={this.updatePercentageState}
          />
        )}

        {isMarketActive && (
          <OrderMarket
            quantityAccuracy={quantityAccuracy}
            action={action}
            quantity={this.props.quantityValue}
            baseAssetName={baseAssetName}
            quoteAssetName={quoteAssetName}
            percents={percents}
            onHandlePercentageChange={this.handlePercentageChange}
            onQuantityChange={this.props.onQuantityChange}
            onReset={this.reset}
            isDisable={isMarketInvalid}
            onSubmit={this.handleButtonClick}
            balance={available}
            isSell={isSellActive}
            // tslint:disable-next-line:jsx-no-lambda
            onResetPercentage={() => resetPercentage(percentage)}
            priceAccuracy={priceAccuracy}
            balanceAccuracy={balanceAccuracy}
            onQuantityArrowClick={this.props.onQuantityArrowClick}
            updatePercentageState={this.updatePercentageState}
          />
        )}
      </div>
    );
  }
}

export default Order;
