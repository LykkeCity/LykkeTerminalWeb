import {ArrowDirection, OrderType, Side} from '../../models';
import {getPercentsOf, precisionFloor} from '../../utils/math';
import {RootStore, UiOrderStore} from '../index';
import {DEFAULT_INPUT_VALUE} from '../../utils/inputNumber';

describe('uiOrder store', () => {
  let uiOrderStore: UiOrderStore;

  beforeEach(() => {
    uiOrderStore = new UiOrderStore(new RootStore());
  });

  describe('values validation', () => {
    const baseAssetBalance = 2;
    const quoteAssetBalance = 2;
    const baseAssetId = 'BTC';
    const quoteAssetId = 'USD';

    it('should return true if quantity value is equal 0', () => {
      const isInvalid = uiOrderStore.isLimitInvalid(
        baseAssetBalance,
        quoteAssetBalance
      );
      expect(isInvalid).toBeTruthy();
    });

    it('should return true if price value is equal 0', () => {
      const isInvalid = uiOrderStore.isLimitInvalid(
        baseAssetBalance,
        quoteAssetBalance
      );
      expect(isInvalid).toBeTruthy();
    });

    it('price accuracy should be 2 by default', () => {
      expect(uiOrderStore.getPriceAccuracy()).toBe(2);
    });

    it('quantity accuracy should be 2 by default', () => {
      expect(uiOrderStore.getQuantityAccuracy()).toBe(2);
    });

    it('should set custom price accuracy', () => {
      uiOrderStore.setPriceAccuracy(3);
      expect(uiOrderStore.getPriceAccuracy()).toBe(3);
    });

    it('should set custom price accuracy', () => {
      uiOrderStore.setQuantityAccuracy(3);
      expect(uiOrderStore.getQuantityAccuracy()).toBe(3);
    });

    it('should change price', () => {
      expect(uiOrderStore.getComputedPriceValue).toBe(DEFAULT_INPUT_VALUE);
      uiOrderStore.handlePriceChange('1');
      expect(uiOrderStore.getComputedPriceValue).toBe('1');
    });

    it('should change quantity', () => {
      expect(uiOrderStore.getComputedQuantityValue).toBe(DEFAULT_INPUT_VALUE);
      uiOrderStore.handleQuantityChange('1');
      expect(uiOrderStore.getComputedQuantityValue).toBe('1');
    });

    it('should increase price by 1 digit', () => {
      const price = '0.02';
      uiOrderStore.handlePriceChange(price);
      expect(uiOrderStore.getComputedPriceValue).toBe(price);
      uiOrderStore.handlePriceArrowClick(ArrowDirection.Up);
      expect(uiOrderStore.getComputedPriceValue).toBe('0.03');
    });

    it('should decrease price by 1 digit', () => {
      const price = '0.02';
      uiOrderStore.handlePriceChange(price);
      expect(uiOrderStore.getComputedPriceValue).toBe(price);
      uiOrderStore.handlePriceArrowClick(ArrowDirection.Down);
      expect(uiOrderStore.getComputedPriceValue).toBe('0.01');
    });

    it('should increase quantity by 1 digit', () => {
      const quantity = '0.02';
      uiOrderStore.handleQuantityChange(quantity);
      expect(uiOrderStore.getComputedQuantityValue).toBe(quantity);
      uiOrderStore.handleQuantityArrowClick(ArrowDirection.Up);
      expect(uiOrderStore.getComputedQuantityValue).toBe('0.03');
    });

    it('should decrease quantity by 1 digit', () => {
      const quantity = '0.02';
      uiOrderStore.handleQuantityChange(quantity);
      expect(uiOrderStore.getComputedQuantityValue).toBe(quantity);
      uiOrderStore.handleQuantityArrowClick(ArrowDirection.Down);
      expect(uiOrderStore.getComputedQuantityValue).toBe('0.01');
    });

    it('should set price with fixing', () => {
      const price = 1;
      expect(uiOrderStore.getComputedPriceValue).toBe(DEFAULT_INPUT_VALUE);
      uiOrderStore.setPriceValueWithFixed(price);
      expect(uiOrderStore.getComputedPriceValue).toBe(
        price.toFixed(uiOrderStore.getPriceAccuracy())
      );
    });

    it('should set quantity with fixing', () => {
      const quantity = 1;
      expect(uiOrderStore.getComputedPriceValue).toBe(DEFAULT_INPUT_VALUE);
      uiOrderStore.setPriceValueWithFixed(quantity);
      expect(uiOrderStore.getComputedPriceValue).toBe(
        quantity.toFixed(uiOrderStore.getQuantityAccuracy())
      );
    });

    it('should set price', () => {
      const price = '1';
      expect(uiOrderStore.getComputedPriceValue).toBe(DEFAULT_INPUT_VALUE);
      uiOrderStore.setPriceValue(price);
      expect(uiOrderStore.getComputedPriceValue).toBe(price);
    });

    it('should set quantity', () => {
      const quantity = '1';
      expect(uiOrderStore.getComputedPriceValue).toBe(DEFAULT_INPUT_VALUE);
      uiOrderStore.setPriceValue(quantity);
      expect(uiOrderStore.getComputedPriceValue).toBe(quantity);
    });

    it('should return current price', () => {
      expect(uiOrderStore.getComputedPriceValue).toBe(
        uiOrderStore.getPriceValue()
      );
    });

    it('should return current quantity', () => {
      expect(uiOrderStore.getComputedQuantityValue).toBe(
        uiOrderStore.getQuantityValue()
      );
    });

    it('should set a limit type for order by default', () => {
      expect(uiOrderStore.currentMarket).toBe(OrderType.Limit);
    });

    it('should change order type', () => {
      expect(uiOrderStore.currentMarket).toBe(OrderType.Limit);
      uiOrderStore.setMarket(OrderType.Market);
      expect(uiOrderStore.currentMarket).toBe(OrderType.Market);
    });

    it('should set sell side by default', () => {
      expect(uiOrderStore.isCurrentSideSell).toBeTruthy();
    });

    it('should change order side', () => {
      expect(uiOrderStore.isCurrentSideSell).toBeTruthy();
      uiOrderStore.setSide(Side.Buy);
      expect(uiOrderStore.isCurrentSideSell).toBeFalsy();
    });

    it('should change price, reset volume, set order type to limit and change the side if market is not limit', () => {
      expect(uiOrderStore.isCurrentSideSell).toBeTruthy();
      expect(uiOrderStore.getComputedPriceValue).toBe(DEFAULT_INPUT_VALUE);
      uiOrderStore.setMarket(OrderType.Market);
      uiOrderStore.setQuantityValue('123');
      expect(uiOrderStore.currentMarket).toBe(OrderType.Market);

      const newPrice = 1;

      uiOrderStore.handlePriceClickFromOrderBook(newPrice, Side.Buy);
      expect(uiOrderStore.isCurrentSideSell).toBeFalsy();
      expect(uiOrderStore.getComputedPriceValue).toBe(
        newPrice.toFixed(uiOrderStore.getPriceAccuracy())
      );
      expect(uiOrderStore.getComputedQuantityValue).toBe(DEFAULT_INPUT_VALUE);
      expect(uiOrderStore.currentMarket).toBe(OrderType.Limit);
    });

    it('should change price and change the side if market is limit', () => {
      expect(uiOrderStore.isCurrentSideSell).toBeTruthy();
      expect(uiOrderStore.getComputedPriceValue).toBe(DEFAULT_INPUT_VALUE);

      const newPrice = 1;

      uiOrderStore.handlePriceClickFromOrderBook(newPrice, Side.Buy);
      expect(uiOrderStore.isCurrentSideSell).toBeFalsy();
      expect(uiOrderStore.getComputedPriceValue).toBe(
        newPrice.toFixed(uiOrderStore.getPriceAccuracy())
      );
    });

    it('should change volume, set order type to market, change the order side', () => {
      expect(uiOrderStore.isCurrentSideSell).toBeTruthy();
      expect(uiOrderStore.getComputedQuantityValue).toBe(DEFAULT_INPUT_VALUE);
      expect(uiOrderStore.currentMarket).toBe(OrderType.Limit);

      const newQuantity = 1;

      uiOrderStore.handleVolumeClickFromOrderBook(newQuantity, Side.Buy);
      expect(uiOrderStore.isCurrentSideSell).toBeFalsy();
      expect(uiOrderStore.getComputedQuantityValue).toBe(
        newQuantity.toFixed(uiOrderStore.getQuantityAccuracy())
      );
      expect(uiOrderStore.currentMarket).toBe(OrderType.Market);
    });

    it('should return calculated percent value of balance for limit and sell side', () => {
      const balance = 100;
      const percents = 30;
      uiOrderStore.handlePercentageChange({balance, percents});
      expect(uiOrderStore.getComputedQuantityValue).toBe(
        uiOrderStore
          .onPercentChangeForLimit(percents, balance, Side.Sell)
          .toFixed(uiOrderStore.getQuantityAccuracy())
      );
    });

    it('should return calculated percent value of balance for limit and buy side', () => {
      const balance = 52284.65;
      const percents = 50;
      uiOrderStore.setSide(Side.Buy);
      uiOrderStore.setPriceValue('1000');
      uiOrderStore.handlePercentageChange({balance, percents});
      expect(uiOrderStore.getComputedQuantityValue).toBe(
        uiOrderStore
          .onPercentChangeForLimit(percents, balance, Side.Buy)
          .toFixed(uiOrderStore.getQuantityAccuracy())
      );
    });

    it('should return calculated percent value of balance for market and sell side', () => {
      const balance = 100;
      const percents = 30;
      uiOrderStore.setMarket(OrderType.Market);
      uiOrderStore.handlePercentageChange({balance, percents});
      expect(uiOrderStore.getComputedQuantityValue).toBe(
        getPercentsOf(
          percents,
          balance,
          uiOrderStore.getQuantityAccuracy()
        ).toFixed(uiOrderStore.getQuantityAccuracy())
      );
    });

    it('should return calculated percent value of balance for market and buy side', () => {
      const convertedBalance = 5263.98;
      uiOrderStore.rootStore.marketStore.convert = () => convertedBalance;

      const balance = 52284.65;
      const percents = 50;
      uiOrderStore.setSide(Side.Buy);
      uiOrderStore.setMarket(OrderType.Market);
      uiOrderStore.handlePercentageChange({balance, percents});
      expect(uiOrderStore.getComputedQuantityValue).toBe(
        getPercentsOf(
          percents,
          convertedBalance,
          uiOrderStore.getQuantityAccuracy()
        ).toFixed(uiOrderStore.getQuantityAccuracy())
      );
    });

    it('should return true if quantity value has default value', () => {
      expect(uiOrderStore.getComputedQuantityValue).toBe(DEFAULT_INPUT_VALUE);
      expect(
        uiOrderStore.isMarketInvalid(
          baseAssetId,
          quoteAssetId,
          baseAssetBalance,
          quoteAssetBalance
        )
      ).toBeTruthy();
    });

    it('should return true if quantity is greater than baseAssetBalance for sell side', () => {
      const quantity = '4';
      uiOrderStore.setQuantityValue(quantity);
      expect(parseFloat(uiOrderStore.getComputedQuantityValue)).toBeGreaterThan(
        baseAssetBalance
      );
      expect(
        uiOrderStore.isMarketInvalid(
          baseAssetId,
          quoteAssetId,
          baseAssetBalance,
          quoteAssetBalance
        )
      ).toBeTruthy();
    });

    it('should return true if quantity is greater than converted balance for buy side', () => {
      const convertedBalance = 5263.98;
      uiOrderStore.rootStore.marketStore.convert = () => convertedBalance;
      const quantity = '6258.368';
      uiOrderStore.setQuantityValue(quantity);
      uiOrderStore.setSide(Side.Buy);
      expect(parseFloat(uiOrderStore.getComputedQuantityValue)).toBeGreaterThan(
        precisionFloor(+convertedBalance, uiOrderStore.getQuantityAccuracy())
      );
      expect(
        uiOrderStore.isMarketInvalid(
          baseAssetId,
          quoteAssetId,
          baseAssetBalance,
          quoteAssetBalance
        )
      ).toBeTruthy();
    });

    it('should reset price and quantity', () => {
      const midPrice = 1256.58;
      uiOrderStore.rootStore.orderBookStore.mid = () => midPrice;

      uiOrderStore.setQuantityValue('123');
      uiOrderStore.setPriceValue('123');
      expect(uiOrderStore.getComputedQuantityValue).not.toBe('0.00');
      expect(uiOrderStore.getComputedPriceValue).not.toBe(
        midPrice.toFixed(uiOrderStore.getPriceAccuracy())
      );

      uiOrderStore.resetOrder();
      expect(uiOrderStore.getComputedQuantityValue).toBe(DEFAULT_INPUT_VALUE);
      expect(uiOrderStore.getComputedPriceValue).toBe(
        midPrice.toFixed(uiOrderStore.getPriceAccuracy())
      );
    });
  });
});
