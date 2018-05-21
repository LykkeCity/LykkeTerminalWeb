import {computed, observable} from 'mobx';
import {curry} from 'rambda';
import {OrderType} from '../models';
import ArrowDirection from '../models/arrowDirection';
import Side from '../models/side';
import {onArrowClick, onValueChange} from '../utils/inputNumber';
import {getPercentsOf, precisionFloor} from '../utils/math';
import {
  getPercentOfValueForLimit,
  isAmountExceedLimitBalance
} from '../utils/order';
import {BaseStore, RootStore} from './index';

class UiOrderStore extends BaseStore {
  @computed
  get getComputedPriceValue() {
    return this.priceValue;
  }

  @computed
  get getComputedQuantityValue() {
    return this.quantityValue;
  }

  @computed
  get currentMarket() {
    return this.market;
  }

  @computed
  get isCurrentSideSell() {
    return this.side === Side.Sell;
  }

  handlePriceChange: (price: string) => void;
  handleQuantityChange: (price: string) => void;
  handlePriceArrowClick: (operation: ArrowDirection) => void;
  handleQuantityArrowClick: (operation: ArrowDirection) => void;
  onPercentChangeForLimit: (
    percents: number,
    value: number,
    side: Side
  ) => number;

  @observable private priceValue: string = '0';
  @observable private quantityValue: string = '0';
  @observable private market: OrderType = OrderType.Limit;
  @observable private side: Side = Side.Sell;
  private priceAccuracy: number = 2;
  private quantityAccuracy: number = 2;

  constructor(store: RootStore) {
    super(store);

    this.handlePriceChange = curry(onValueChange)(
      this.setPriceValue,
      this.getPriceAccuracy
    );
    this.handleQuantityChange = curry(onValueChange)(
      this.setQuantityValue,
      this.getQuantityAccuracy
    );
    this.handlePriceArrowClick = curry(onArrowClick)(
      this.getPriceValue,
      this.getPriceAccuracy,
      this.setPriceValueWithFixed
    );
    this.handleQuantityArrowClick = curry(onArrowClick)(
      this.getQuantityValue,
      this.getQuantityAccuracy,
      this.setQuantityValueWithFixed
    );

    this.onPercentChangeForLimit = curry(getPercentOfValueForLimit)(
      this.getPriceValue,
      this.getQuantityAccuracy
    );
  }

  setPriceValueWithFixed = (price: number) =>
    (this.priceValue = price.toFixed(this.priceAccuracy));
  setQuantityValueWithFixed = (quantity: number) =>
    (this.quantityValue = quantity.toFixed(this.quantityAccuracy));

  setPriceValue = (price: string) => (this.priceValue = price);
  setQuantityValue = (quantity: string) => (this.quantityValue = quantity);

  getPriceValue = () => this.priceValue;
  getQuantityValue = () => this.quantityValue;

  getPriceAccuracy = () => this.priceAccuracy;
  getQuantityAccuracy = () => this.quantityAccuracy;
  setPriceAccuracy = (priceAcc: number) => (this.priceAccuracy = priceAcc);
  setQuantityAccuracy = (quantityAcc: number) =>
    (this.quantityAccuracy = quantityAcc);

  setMarket = (type: OrderType) => (this.market = type);
  setSide = (side: Side) => (this.side = side);

  handlePriceClickFromOrderBook = (price: number, side: Side) => {
    this.setPriceValueWithFixed(price);
    this.setQuantityValueWithFixed(0);
    this.setMarket(OrderType.Limit);
    this.setSide(side);
  };

  handleVolumeClickFromOrderBook = (volume: number, side: Side) => {
    const orderSide = side === Side.Sell ? Side.Buy : Side.Sell;
    this.setQuantityValue(`${volume}`);
    this.setMarket(OrderType.Market);
    this.setSide(orderSide);
  };

  onPercentChangeForMarket = (
    percents: number,
    value: number,
    quoteAssetId: string,
    baseAssetId: string
  ) => {
    if (this.isCurrentSideSell) {
      return getPercentsOf(percents, value, this.getQuantityAccuracy());
    }
    const convertedBalance = this.rootStore.marketStore.convert(
      value,
      quoteAssetId,
      baseAssetId,
      this.rootStore.referenceStore.getInstrumentById
    );
    return getPercentsOf(
      percents,
      convertedBalance,
      this.getQuantityAccuracy()
    );
  };

  handlePercentageChange = (config: any) => {
    const {balance, baseAssetId, quoteAssetId, percents} = config;

    const isLimitActive = this.market === OrderType.Limit;
    if (isLimitActive) {
      this.setQuantityValueWithFixed(
        this.onPercentChangeForLimit(percents, balance, this.side)
      );
    } else {
      this.setQuantityValueWithFixed(
        this.onPercentChangeForMarket(
          percents,
          balance,
          quoteAssetId,
          baseAssetId
        )
      );
    }
  };

  isLimitInvalid = (baseAssetBalance: number, quoteAssetBalance: number) => {
    return (
      !+this.priceValue ||
      !+this.quantityValue ||
      isAmountExceedLimitBalance(
        this.isCurrentSideSell,
        this.quantityValue,
        this.priceValue,
        baseAssetBalance,
        quoteAssetBalance,
        this.priceAccuracy,
        this.quantityAccuracy
      )
    );
  };

  isMarketInvalid = (
    baseAssetId: string,
    quoteAssetId: string,
    baseAssetBalance: number,
    quoteAssetBalance: number
  ) => {
    return (
      !+this.quantityValue ||
      this.isAmountExceedMarketBalance(
        baseAssetBalance,
        quoteAssetBalance,
        baseAssetId,
        quoteAssetId
      )
    );
  };

  isAmountExceedMarketBalance = (
    baseAssetBalance: number,
    quoteAssetBalance: number,
    baseAssetId: string,
    quoteAssetId: string
  ) => {
    const convertedBalance = this.rootStore.marketStore.convert(
      quoteAssetBalance,
      quoteAssetId,
      baseAssetId,
      this.rootStore.referenceStore.getInstrumentById
    );
    return this.isCurrentSideSell
      ? +this.quantityValue > baseAssetBalance
      : +this.quantityValue >
          precisionFloor(+convertedBalance, this.quantityAccuracy);
  };

  resetOrder = () => {
    this.setPriceValueWithFixed(this.rootStore.orderBookStore.mid());
    this.setQuantityValueWithFixed(0);
  };

  // tslint:disable-next-line:no-empty
  reset = () => {};
}

export default UiOrderStore;
