import {computed, observable} from 'mobx';
import {curry} from 'rambda';
import {ArrowDirection, OrderType, Side} from '../models';
import {
  getMaxAvailableVolume,
  mapToEffectivePrice
} from '../models/mappers/orderMapper';
import {
  DEFAULT_INPUT_VALUE,
  onArrowClick,
  onValueChange
} from '../utils/inputNumber';
import {bigToFixed, getPercentsOf, precisionFloor} from '../utils/math';
import {
  getPercentOfValueForLimit,
  isAmountExceedLimitBalance
} from '../utils/order';
import {BaseStore, RootStore} from './index';

const MARKET_TOTAL_DEBOUNCE = 1000;

export interface PercentageChangeConfig {
  balance: number;
  baseAssetId: string;
  quoteAssetId: string;
  percents: number;
}

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

  @computed
  get marketTotalPrice() {
    return this.marketTotal.price;
  }

  @computed
  get isEnoughLiquidity() {
    return this.marketTotal.isEnoughLiquidity;
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

  @observable
  marketTotal: any = {
    canBeUpdated: true,
    operationType: '',
    operationVolume: 0,
    isEnoughLiquidity: true,
    price: 0
  };
  @observable private priceValue: string = DEFAULT_INPUT_VALUE;
  @observable private quantityValue: string = DEFAULT_INPUT_VALUE;
  @observable private market: OrderType = OrderType.Limit;
  @observable private side: Side = Side.Buy;
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
    (this.priceValue = !price
      ? DEFAULT_INPUT_VALUE
      : bigToFixed(price, this.priceAccuracy).toString());
  setQuantityValueWithFixed = (quantity: number | string) =>
    (this.quantityValue = !quantity
      ? DEFAULT_INPUT_VALUE
      : bigToFixed(quantity, this.quantityAccuracy).toString());

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
    if (this.market !== OrderType.Limit) {
      this.setQuantityValueWithFixed(0);
      this.setMarket(OrderType.Limit);
    }
    this.setSide(side);
  };

  handleVolumeClickFromOrderBook = (volume: number, side: Side) => {
    this.setQuantityValueWithFixed(volume);
    this.setMarket(OrderType.Market);
    this.setSide(side);
    this.setMarketTotal(volume, side);
  };

  handlePercentageChange = (config: PercentageChangeConfig) => {
    const {balance, baseAssetId, quoteAssetId, percents} = config;

    if (this.market === OrderType.Limit) {
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
      this.setMarketTotal(this.quantityValue, this.side);
    }
  };

  handleMarketQuantityArrowClick = (operation: ArrowDirection) => {
    this.handleQuantityArrowClick(operation);
    this.setMarketTotal(this.quantityValue, this.side, true);
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
    const convertedBalance = getMaxAvailableVolume(
      value,
      this.rootStore.orderBookStore.rawAsks
    );

    return getPercentsOf(
      percents,
      convertedBalance,
      this.getQuantityAccuracy()
    );
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

  setMarketTotal = (
    operationVolume?: any,
    operationType?: Side,
    debounce?: boolean
  ) => {
    if (operationVolume === '') {
      return this.resetMarketTotal();
    }

    const areNewValues = operationVolume && operationType;
    const areOldValues = !operationVolume && !operationType;
    const isDebounceByWamp = areOldValues && !this.marketTotal.canBeUpdated;
    const isDebounceManually =
      areNewValues && !this.marketTotal.canBeUpdated && debounce;

    if (isDebounceByWamp || isDebounceManually) {
      return;
    } else if (areOldValues || debounce) {
      this.setDebounce();
    }

    if (operationVolume) {
      this.marketTotal.operationVolume =
        typeof operationVolume === 'number'
          ? operationVolume
          : parseFloat(operationVolume);
    }
    if (operationType) {
      this.marketTotal.operationType = operationType;
    }

    this.marketTotal.price = mapToEffectivePrice(
      this.marketTotal.operationVolume,
      this.getOrdersByOperationType()
    );

    this.marketTotal.isEnoughLiquidity = this.marketTotal.price !== null;
  };

  resetMarketTotal = () => {
    this.marketTotal = {
      canBeUpdated: true,
      operationType: '',
      operationVolume: 0,
      price: 0,
      isEnoughLiquidity: true
    };
  };

  resetOrder = async () => {
    const mid = await this.rootStore.orderBookStore.mid();
    this.setPriceValueWithFixed(mid);
    this.setQuantityValue(DEFAULT_INPUT_VALUE);
  };

  // tslint:disable-next-line:no-empty
  reset = () => {};

  private setDebounce = () => {
    this.marketTotal.canBeUpdated = false;
    setTimeout(
      () => (this.marketTotal.canBeUpdated = true),
      MARKET_TOTAL_DEBOUNCE
    );
  };

  private getOrdersByOperationType = () => {
    switch (this.marketTotal.operationType) {
      case Side.Sell:
        return this.rootStore.orderBookStore.rawBids;
      case Side.Buy:
        return this.rootStore.orderBookStore.rawAsks;
      default:
        return [];
    }
  };
}

export default UiOrderStore;
