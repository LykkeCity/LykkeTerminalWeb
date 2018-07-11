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
import withScroll from '../CustomScrollbar/withScroll';
import ConfirmModal from '../Modal/ConfirmModal';
import ActionChoiceButton from './ActionChoiceButton';
import {Disclaimer} from './Disclaimer';
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
  handlePriceArrowClick: (operation: string) => void;
  handleQuantityArrowClick: (operation: string) => void;
  handleMarketQuantityArrowClick: (operation: string) => void;
  handlePriceChange: (value: string) => void;
  handleQuantityChange: (value: string) => void;
  setMarket: (value: OrderType) => void;
  setSide: (side: Side) => void;
  currentMarket: OrderType;
  isCurrentSideSell: boolean;
  resetOrder: () => void;
  isDisclaimerShown: boolean;
  disclaimedAssets: string[];
  setMarketTotal: (
    operationVolume?: any,
    operationType?: string,
    debounce?: boolean
  ) => void;
  marketTotalPrice: number;
  isEnoughLiquidity: boolean;
  resetMarketTotal: () => void;
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

  componentDidMount() {
    this.props.resetOrder();
  }

  handleSideClick = (side: Side) => () => {
    resetPercentage(percentage);
    this.props.setSide(side);
    this.props.setMarketTotal(null, side);
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
    action: Side,
    quantity: string,
    baseAssetId: string,
    price: string
  ) => {
    this.disableButton(true);
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
    this.closeConfirmModal();
    this.props
      .placeOrder(orderType, body)
      .then(() => this.disableButton(false))
      .catch(() => this.disableButton(false));
  };

  closeConfirmModal = () => {
    this.setState({
      isConfirmModalOpen: false
    });
  };

  handleButtonClick = () => {
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

  updatePercentageState = (field: OrderInputs) => {
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
    this.props.resetMarketTotal();
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
      isDisclaimerShown,
      disclaimedAssets,
      setMarketTotal,
      marketTotalPrice,
      isEnoughLiquidity
    } = this.props;
    const {
      priceValue,
      quantityValue,
      currentMarket,
      isCurrentSideSell,
      handlePriceChange,
      handleQuantityChange,
      handlePriceArrowClick,
      handleQuantityArrowClick,
      handleMarketQuantityArrowClick
    } = this.props;
    const {percents} = this.state;
    const currentPrice =
      (currentMarket === MARKET
        ? isCurrentSideSell ? bid : ask
        : parseFloat(priceValue)) || 0;

    const roundedAmount = precisionFloor(
      currentPrice * parseFloat(quantityValue),
      quoteAssetAccuracy
    );

    const isLimitInvalid =
      this.state.pendingOrder ||
      !roundedAmount ||
      this.props.isLimitInvalid(baseAssetBalance, quoteAssetBalance);

    const isMarketInvalid =
      this.state.pendingOrder ||
      !roundedAmount ||
      this.props.isMarketInvalid(
        baseAssetId,
        quoteAssetId,
        baseAssetBalance,
        quoteAssetBalance
      );

    const availableBalance = isCurrentSideSell
      ? baseAssetBalance
      : quoteAssetBalance;

    const balanceAccuracy = isCurrentSideSell
      ? baseAssetAccuracy
      : quoteAssetAccuracy;

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
            title={Side.Buy}
            click={this.handleSideClick(Side.Buy)}
            isActive={!isCurrentSideSell}
          />
          <ActionChoiceButton
            title={Side.Sell}
            click={this.handleSideClick(Side.Sell)}
            isActive={isCurrentSideSell}
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
            onPriceChange={handlePriceChange}
            onQuantityChange={handleQuantityChange}
            onPriceArrowClick={handlePriceArrowClick}
            onQuantityArrowClick={handleQuantityArrowClick}
            baseAssetAccuracy={baseAssetAccuracy}
            percents={percents}
            onHandlePercentageChange={this.handlePercentageChange}
            baseAssetName={baseAssetName}
            quoteAssetName={quoteAssetName}
            isSell={isCurrentSideSell}
            amount={formattedNumber(roundedAmount || 0, quoteAssetAccuracy)}
            isDisable={isLimitInvalid}
            onReset={this.reset}
            balance={availableBalance}
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
            amount={formattedNumber(marketTotalPrice || 0, quoteAssetAccuracy)}
            quantityAccuracy={quantityAccuracy}
            action={isCurrentSideSell ? Side.Sell : Side.Buy}
            quantity={quantityValue}
            baseAssetName={baseAssetName}
            quoteAssetName={quoteAssetName}
            percents={percents}
            onHandlePercentageChange={this.handlePercentageChange}
            onQuantityChange={handleQuantityChange}
            onReset={this.reset}
            isDisable={isMarketInvalid}
            onSubmit={this.handleButtonClick}
            balance={availableBalance}
            isSell={isCurrentSideSell}
            // tslint:disable-next-line:jsx-no-lambda
            onResetPercentage={() => resetPercentage(percentage)}
            priceAccuracy={priceAccuracy}
            balanceAccuracy={balanceAccuracy}
            onMarketQuantityArrowClick={handleMarketQuantityArrowClick}
            updatePercentageState={this.updatePercentageState}
            setMarketTotal={setMarketTotal}
            isEnoughLiquidity={isEnoughLiquidity}
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
            onClose={this.closeConfirmModal}
            message={this.getConfirmMessage()}
          />
        )}
        {isDisclaimerShown &&
          disclaimedAssets.map((asset, index) => (
            <Disclaimer asset={asset} key={`${asset}_${index}`} />
          ))}
      </React.Fragment>
    );
  }
}

export default withScroll(Order);
