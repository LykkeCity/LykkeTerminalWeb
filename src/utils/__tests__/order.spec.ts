import {Side} from '../../models';
import {getPercentsOf} from '../math';
import {
  getPercentOfValueForLimit,
  isAmountExceedLimitBalance,
  resetPercentage,
  setActivePercentage
} from '../order';

describe('order utils', () => {
  let quantityValue = '0.0';
  let priceValue = '0.0';
  let isSell = true;
  const baseAssetBalance = 2;
  const quoteAssetBalance = 2;
  const priceAccuracy = 0;
  const quantityAccuracy = 0;

  it('should return true if amount exceeds limit balance and sell is true', () => {
    quantityValue = '3.0';
    const isInvalid = isAmountExceedLimitBalance(
      isSell,
      quantityValue,
      priceValue,
      baseAssetBalance,
      quoteAssetBalance,
      priceAccuracy,
      quantityAccuracy
    );
    expect(isInvalid).toBeTruthy();
  });

  it('should return true if amount exceeds limit balance and sell is false', () => {
    quantityValue = '3.0';
    priceValue = '1.0';
    isSell = false;
    const isInvalid = isAmountExceedLimitBalance(
      isSell,
      quantityValue,
      priceValue,
      baseAssetBalance,
      quoteAssetBalance,
      priceAccuracy,
      quantityAccuracy
    );
    expect(isInvalid).toBeTruthy();
  });

  it('should return false if amount does not exceed limit balance and sell is true', () => {
    quantityValue = '1.0';
    const isInvalid = isAmountExceedLimitBalance(
      isSell,
      quantityValue,
      priceValue,
      baseAssetBalance,
      quoteAssetBalance,
      priceAccuracy,
      quantityAccuracy
    );
    expect(isInvalid).toBeFalsy();
  });

  it('should return false if amount does not exceed limit balance and sell is false', () => {
    quantityValue = '1.0';
    priceValue = '1.0';
    isSell = false;
    const isInvalid = isAmountExceedLimitBalance(
      isSell,
      quantityValue,
      priceValue,
      baseAssetBalance,
      quoteAssetBalance,
      priceAccuracy,
      quantityAccuracy
    );
    expect(isInvalid).toBeFalsy();
  });

  describe('calculations for limit order', () => {
    const price = 5986.365;
    const accuracy = 5;
    const balance = 1256.586;
    const percents = 26;

    it('should return value for sell side', () => {
      const result = getPercentOfValueForLimit(
        () => `${price}`,
        () => accuracy,
        percents,
        balance,
        Side.Sell
      );

      expect(result).toBe(getPercentsOf(percents, balance, accuracy));
    });

    it('should return value for buy side', () => {
      const result = getPercentOfValueForLimit(
        () => `${price}`,
        () => accuracy,
        percents,
        balance,
        Side.Buy
      );

      expect(result).toBe(
        getPercentsOf(percents, balance / parseFloat(`${price}`), accuracy)
      );
    });
  });

  describe('edge prices', () => {
    it('should be valid if the total price mathematically the same as available amount and direction is buy', () => {
      quantityValue = (2050.352 / 5848.989).toFixed(8);
      priceValue = '5848.989';
      isSell = false;
      const isInvalid = isAmountExceedLimitBalance(
        isSell,
        quantityValue,
        priceValue,
        baseAssetBalance,
        2050.352,
        3,
        8
      );
      const valid = !isInvalid;
      expect(isInvalid).toBeFalsy();
      expect(valid).toBe(true);
    });

    it('should be invalid if the total price slightly differs from the available amount and direction is buy', () => {
      const amountTaken = 2050.353;
      quantityValue = (amountTaken * 1.000001 / 5848.989).toFixed(8);
      priceValue = '5848.989';
      isSell = false;
      const isInvalid = isAmountExceedLimitBalance(
        isSell,
        quantityValue,
        priceValue,
        baseAssetBalance,
        amountTaken,
        3,
        8
      );
      expect(isInvalid).toBe(true);
    });
  });

  describe('percentage', () => {
    const percentage = [
      {
        isActive: false,
        percent: 25
      },
      {
        isActive: false,
        percent: 58
      },
      {
        isActive: false,
        percent: 99
      }
    ];

    it('should set active to item by index', () => {
      const index = 1;
      setActivePercentage(percentage, index);
      expect(percentage[index].isActive).toBeTruthy();
    });

    it('should return dto with chosen percent and updated arr', () => {
      const index = 1;
      const result = setActivePercentage(percentage, index);
      expect(result.percents).toBe(percentage[index].percent);
      expect(result.updatedPercentage[index].isActive).toBeTruthy();
    });

    it('should reset isActive for arr', () => {
      const index = 1;
      setActivePercentage(percentage, index);
      expect(percentage[index].isActive).toBeTruthy();

      resetPercentage(percentage);
      expect(percentage[index].isActive).toBeFalsy();
    });
  });
});
