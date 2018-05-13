import {computed, observable} from 'mobx';
import {OrderType} from '../models';
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

  onPriceChange: any;
  onQuantityChange: any;
  onPriceArrowClick: any;
  onQuantityArrowClick: any;
  onPercentChangeForLimit: any;

  @observable private priceValue: string = '0';
  @observable private quantityValue: string = '0';
  @observable private market: OrderType = OrderType.Limit;
  @observable private side: Side = Side.Sell;
  private priceAccuracy: number = 2;
  private quantityAccuracy: number = 2;

  constructor(store: RootStore) {
    super(store);

    this.onPriceChange = onValueChange(
      this.setPriceValueByHand,
      this.getPriceAccuracy
    );
    this.onQuantityChange = onValueChange(
      this.setQuantityValueByHand,
      this.getQuantityAccuracy
    );
    this.onPriceArrowClick = onArrowClick(
      this.getPriceValue,
      this.getPriceAccuracy,
      this.setPriceValue
    );
    this.onQuantityArrowClick = onArrowClick(
      this.getQuantityValue,
      this.getQuantityAccuracy,
      this.setQuantityValue
    );

    this.onPercentChangeForLimit = getPercentOfValueForLimit(
      this.getPriceValue,
      this.getQuantityAccuracy
    );
  }

  setPriceValue = (price: number) =>
    (this.priceValue = price.toFixed(this.priceAccuracy));
  setQuantityValue = (quantity: number) =>
    (this.quantityValue = quantity.toFixed(this.quantityAccuracy));

  setPriceValueByHand = (price: string) => (this.priceValue = price);
  setQuantityValueByHand = (quantity: string) =>
    (this.quantityValue = quantity);

  getPriceValue = () => this.priceValue;
  getQuantityValue = () => this.quantityValue;

  getPriceAccuracy = () => this.priceAccuracy;
  getQuantityAccuracy = () => this.quantityAccuracy;
  setPriceAccuracy = (priceAcc: number) => (this.priceAccuracy = priceAcc);
  setQuantityAccuracy = (quantityAcc: number) =>
    (this.quantityAccuracy = quantityAcc);

  setMarket = (type: OrderType) => (this.market = type);
  setSide = (side: Side) => (this.side = side);

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
      this.setQuantityValue(
        this.onPercentChangeForLimit(percents, balance, this.side)
      );
    } else {
      this.setQuantityValue(
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
    this.setPriceValue(this.rootStore.orderBookStore.mid());
    this.setQuantityValue(0);
  };

  // tslint:disable-next-line:no-empty
  reset = () => {};
}

export default UiOrderStore;
