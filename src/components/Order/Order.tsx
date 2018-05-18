import * as React from 'react';
import {Percentage} from '../../constants/ordersPercentage';
import {keys} from '../../models';
import {OrderInputs, OrderType} from '../../models';
import InstrumentModel from '../../models/instrumentModel';
import Side from '../../models/side';
import {StorageUtils} from '../../utils/index';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {precisionFloor} from '../../utils/math';
import {resetPercentage, setActivePercentage} from '../../utils/order';
import ConfirmModal from '../Modal/ConfirmModal';
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

interface OrderState {
  pendingOrder: boolean;
  percents: any[];
  isConfirmModalOpen: boolean;
}

interface OrderProps {
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
  baseAssetBalance: any;
  quoteAssetBalance: any;
  mid: number;
  handlePercentageChange: any;
  baseAssetId: string;
  quoteAssetId: string;
  isLimitInvalid: (
    baseAssetBalance: number,
    quoteAssetBalance: number
  ) => boolean;
  isMarketInvalid: (
    baseAssetId: string,
    quoteAssetId: string,
    baseAssetBalance: number,
    quoteAssetBalance: number
  ) => boolean;
  instrument: InstrumentModel;
  priceValue: string;
  quantityValue: string;
  onPriceArrowClick: (operation: string) => void;
  onQuantityArrowClick: (operation: string) => void;
  onPriceChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  setMarket: (value: OrderType) => void;
  setSide: (side: Side) => void;
  currentMarket: OrderType;
  isCurrentSideSell: boolean;
  resetOrder: () => void;
}

class Order extends React.Component<OrderProps, OrderState> {
  constructor(props: OrderProps) {
    super(props);
    this.state = {
      pendingOrder: false,
      percents: percentage,
      isConfirmModalOpen: false
    };
  }

  handleSideClick = (side: Side) => () => {
    resetPercentage(percentage);
    this.props.setSide(side);
    this.setState({
      percents: percentage
    });
  };

  handleMarketClick = (market: OrderType) => () => {
    this.reset();
    this.props.setMarket(market);
    this.setState({
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
    const orderType = this.props.currentMarket;
    const body: any = {
      AssetId: baseAssetId,
      AssetPairId: this.props.currency,
      OrderAction: action,
      Volume: parseFloat(quantity)
    };

    if (this.props.currentMarket === LIMIT) {
      body.Price = parseFloat(price);
    }

    this.props
      .placeOrder(orderType, body)
      .then(() => this.disableButton(false))
      .catch(() => this.disableButton(false));
  };

  cancelOrder = () => {
    this.setState({
      isConfirmModalOpen: false
    });
    this.disableButton(false);
  };

  handleButtonClick = () => {
    this.disableButton(true);
    const {
      quantityValue,
      priceValue,
      isCurrentSideSell,
      baseAssetId
    } = this.props;

    const isConfirm = confirmStorage.get() as string;
    if (!JSON.parse(isConfirm)) {
      return this.applyOrder(
        isCurrentSideSell ? Side.Sell : Side.Buy,
        quantityValue,
        baseAssetId,
        priceValue
      );
    }
    this.setState({
      isConfirmModalOpen: true
    });
  };

  updatePercentageState = (field: string) => {
    const {currentMarket} = this.props;
    const tempObj: any = {};
    if (currentMarket === LIMIT && field === OrderInputs.Quantity) {
      resetPercentage(percentage);
      tempObj.percents = percentage;
    } else if (currentMarket === MARKET) {
      resetPercentage(percentage);
      tempObj.percents = percentage;
    }
    this.setState(tempObj);
  };

  handlePercentageChange = (index?: number) => () => {
    const {
      baseAssetBalance,
      quoteAssetBalance,
      baseAssetId,
      quoteAssetId,
      isCurrentSideSell
    } = this.props;
    const balance = isCurrentSideSell ? baseAssetBalance : quoteAssetBalance;

    if (!balance) {
      return;
    }

    const {updatedPercentage, percents} = setActivePercentage(
      percentage,
      index
    );

    this.props.handlePercentageChange({
      balance,
      baseAssetId,
      quoteAssetId,
      percents
    });

    this.setState({
      percents: updatedPercentage
    });
  };

  getConfirmMessage = () => {
    const action = this.props.isCurrentSideSell ? Side.Sell : Side.Buy;
    const {
      baseAssetName,
      quoteAssetName,
      currentMarket,
      priceValue,
      quantityValue,
      accuracy: {priceAccuracy, baseAssetAccuracy}
    } = this.props;

    const displayedPrice = formattedNumber(
      +parseFloat(priceValue),
      priceAccuracy
    );

    const displayedQuantity = formattedNumber(
      +parseFloat(quantityValue),
      baseAssetAccuracy
    );

    const messageSuffix =
      currentMarket === MARKET
        ? 'at the market price'
        : `at the price of ${displayedPrice} ${quoteAssetName}`;
    return `${action.toLowerCase()} ${displayedQuantity} ${baseAssetName} ${messageSuffix}`;
  };

  reset = () => {
    resetPercentage(percentage);
    this.props.resetOrder();
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
      baseAssetId,
      quoteAssetId,
      priceValue,
      quantityValue,
      currentMarket,
      isCurrentSideSell,
      onPriceChange,
      onQuantityChange,
      onPriceArrowClick,
      onQuantityArrowClick
    } = this.props;
    const {percents} = this.state;
    const currentPrice =
      (currentMarket === MARKET
        ? isCurrentSideSell ? bid : ask
        : parseFloat(priceValue)) || 0;

    const isLimitInvalid =
      this.state.pendingOrder ||
      this.props.isLimitInvalid(baseAssetBalance, quoteAssetBalance);

    const isMarketInvalid =
      this.state.pendingOrder ||
      this.props.isMarketInvalid(
        baseAssetId,
        quoteAssetId,
        baseAssetBalance,
        quoteAssetBalance
      );

    const available = isCurrentSideSell ? baseAssetBalance : quoteAssetBalance;

    const balanceAccuracy = isCurrentSideSell
      ? baseAssetAccuracy
      : quoteAssetAccuracy;

    const roundedAmount = precisionFloor(
      currentPrice * parseFloat(quantityValue),
      quoteAssetAccuracy
    );

    return (
      <React.Fragment>
        <Markets>
          <MarketChoiceButton
            title={LIMIT}
            isActive={currentMarket === LIMIT}
            click={this.handleMarketClick(LIMIT)}
          />
          <MarketChoiceButton
            title={MARKET}
            isActive={currentMarket === MARKET}
            click={this.handleMarketClick(MARKET)}
          />
        </Markets>

        <Actions>
          <ActionChoiceButton
            title={Side.Sell}
            click={this.handleSideClick(Side.Sell)}
            isActive={isCurrentSideSell}
          />
          <ActionChoiceButton
            title={Side.Buy}
            click={this.handleSideClick(Side.Buy)}
            isActive={!isCurrentSideSell}
          />
        </Actions>

        {currentMarket === LIMIT && (
          <OrderLimit
            action={isCurrentSideSell ? Side.Sell : Side.Buy}
            onSubmit={this.handleButtonClick}
            quantity={quantityValue}
            price={priceValue}
            quantityAccuracy={quantityAccuracy}
            priceAccuracy={priceAccuracy}
            onPriceChange={onPriceChange}
            onQuantityChange={onQuantityChange}
            onPriceArrowClick={onPriceArrowClick}
            onQuantityArrowClick={onQuantityArrowClick}
            baseAssetAccuracy={baseAssetAccuracy}
            percents={percents}
            onHandlePercentageChange={this.handlePercentageChange}
            baseAssetName={baseAssetName}
            quoteAssetName={quoteAssetName}
            isSell={isCurrentSideSell}
            amount={formattedNumber(roundedAmount || 0, quoteAssetAccuracy)}
            isDisable={isLimitInvalid}
            onReset={this.reset}
            balance={available}
            buttonMessage={`${
              isCurrentSideSell ? Side.Sell : Side.Buy
            } ${formattedNumber(
              +quantityValue,
              quantityAccuracy
            )} ${baseAssetName}`}
            balanceAccuracy={balanceAccuracy}
            updatePercentageState={this.updatePercentageState}
          />
        )}

        {currentMarket === MARKET && (
          <OrderMarket
            quantityAccuracy={quantityAccuracy}
            action={isCurrentSideSell ? Side.Sell : Side.Buy}
            quantity={quantityValue}
            baseAssetName={baseAssetName}
            quoteAssetName={quoteAssetName}
            percents={percents}
            onHandlePercentageChange={this.handlePercentageChange}
            onQuantityChange={onQuantityChange}
            onReset={this.reset}
            isDisable={isMarketInvalid}
            onSubmit={this.handleButtonClick}
            balance={available}
            isSell={isCurrentSideSell}
            // tslint:disable-next-line:jsx-no-lambda
            onResetPercentage={() => resetPercentage(percentage)}
            priceAccuracy={priceAccuracy}
            balanceAccuracy={balanceAccuracy}
            onQuantityArrowClick={onQuantityArrowClick}
            updatePercentageState={this.updatePercentageState}
          />
        )}
        {this.state.isConfirmModalOpen && (
          <ConfirmModal
            // tslint:disable-next-line:jsx-no-lambda
            onApply={() =>
              this.applyOrder(
                isCurrentSideSell ? Side.Sell : Side.Buy,
                quantityValue,
                baseAssetId,
                priceValue
              )
            }
            onClose={this.cancelOrder}
            message={this.getConfirmMessage()}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Order;
