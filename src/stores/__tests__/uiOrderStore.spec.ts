import {RootStore, UiOrderStore} from '../index';

describe('uiOrder store', () => {
  let uiOrderStore: UiOrderStore;
  let accuracy: number = 1;
  const value: string = '0.1';
  let operation: string;
  const field: string = 'price';

  beforeEach(() => {
    uiOrderStore = new UiOrderStore(new RootStore(false));
  });

  it('should increase value', () => {
    operation = 'up';
    const gottenObject = uiOrderStore.onArrowClick({
      accuracy,
      field,
      operation,
      value
    });
    expect(gottenObject[field]).toBe(
      (parseFloat(value) + Math.pow(10, -1 * accuracy)).toFixed(accuracy)
    );
  });

  it('should decrease value', () => {
    operation = 'down';
    const gottenObject = uiOrderStore.onArrowClick({
      accuracy,
      field,
      operation,
      value
    });
    expect(gottenObject[field]).toBe(
      (parseFloat(value) - Math.pow(10, -1 * accuracy)).toFixed(accuracy)
    );
  });

  it('should fixed value with accuracy', () => {
    const currentPrice = 1;
    const quantityValue = '0.1';
    accuracy = 2;
    expect(
      uiOrderStore.fixedAmount(currentPrice, quantityValue, accuracy)
    ).toBe((currentPrice * parseFloat(quantityValue)).toFixed(accuracy));
  });

  it('should return object with fixed value', () => {
    accuracy = 3;
    const gottenObject = uiOrderStore.onValueChange({field, accuracy, value});
    expect(gottenObject![field]).toBe(value);
  });

  describe('values validation', () => {
    let quantityValue = '0.0';
    let priceValue = '0.0';
    let isSell = true;
    const baseAssetBalance = 2;
    const quoteAssetBalance = 2;
    const priceAccuracy = 0;

    it('should return true if quantity value is equal 0', () => {
      const isInvalid = uiOrderStore.isLimitInvalid(
        isSell,
        quantityValue,
        priceValue,
        baseAssetBalance,
        quoteAssetBalance,
        priceAccuracy
      );
      expect(isInvalid).toBeTruthy();
    });

    it('should return true if price value is equal 0', () => {
      quantityValue = '0.1';
      const isInvalid = uiOrderStore.isLimitInvalid(
        isSell,
        quantityValue,
        priceValue,
        baseAssetBalance,
        quoteAssetBalance,
        priceAccuracy
      );
      expect(isInvalid).toBeTruthy();
    });

    it('should return true if amount exceeds limit balance and sell is true', () => {
      quantityValue = '3.0';
      const isInvalid = uiOrderStore.isAmountExceedLimitBalance(
        isSell,
        quantityValue,
        priceValue,
        baseAssetBalance,
        quoteAssetBalance,
        priceAccuracy
      );
      expect(isInvalid).toBeTruthy();
    });

    it('should return true if amount exceeds limit balance and sell is false', () => {
      quantityValue = '3.0';
      priceValue = '1.0';
      isSell = false;
      const isInvalid = uiOrderStore.isAmountExceedLimitBalance(
        isSell,
        quantityValue,
        priceValue,
        baseAssetBalance,
        quoteAssetBalance,
        priceAccuracy
      );
      expect(isInvalid).toBeTruthy();
    });

    it('should return false if amount does not exceed limit balance and sell is true', () => {
      quantityValue = '1.0';
      const isInvalid = uiOrderStore.isAmountExceedLimitBalance(
        isSell,
        quantityValue,
        priceValue,
        baseAssetBalance,
        quoteAssetBalance,
        priceAccuracy
      );
      expect(isInvalid).toBeFalsy();
    });

    it('should return false if amount does not exceed limit balance and sell is false', () => {
      quantityValue = '1.0';
      priceValue = '1.0';
      isSell = false;
      const isInvalid = uiOrderStore.isAmountExceedLimitBalance(
        isSell,
        quantityValue,
        priceValue,
        baseAssetBalance,
        quoteAssetBalance,
        priceAccuracy
      );
      expect(isInvalid).toBeFalsy();
    });
  });
});
