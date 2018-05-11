import {RootStore, UiOrderStore} from '../index';

describe('uiOrder store', () => {
  let uiOrderStore: UiOrderStore;

  beforeEach(() => {
    uiOrderStore = new UiOrderStore(new RootStore(false));
  });

  describe('values validation', () => {
    let quantityValue = '0.0';
    let priceValue = '0.0';
    let isSell = true;
    const baseAssetBalance = 2;
    const quoteAssetBalance = 2;
    const priceAccuracy = 0;
    const quantityAccuracy = 0;

    it('should return true if quantity value is equal 0', () => {
      const isInvalid = uiOrderStore.isLimitInvalid(
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

    it('should return true if price value is equal 0', () => {
      quantityValue = '0.1';
      const isInvalid = uiOrderStore.isLimitInvalid(
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

    it('should return true if amount exceeds limit balance and sell is true', () => {
      quantityValue = '3.0';
      const isInvalid = uiOrderStore.isAmountExceedLimitBalance(
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
      const isInvalid = uiOrderStore.isAmountExceedLimitBalance(
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
      const isInvalid = uiOrderStore.isAmountExceedLimitBalance(
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
      const isInvalid = uiOrderStore.isAmountExceedLimitBalance(
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

    describe('edge prices', () => {
      it('should be valid if the total price mathematically the same as available amount and direction is buy', () => {
        quantityValue = (2050.352 / 5848.989).toFixed(8);
        priceValue = '5848.989';
        isSell = false;
        const isInvalid = uiOrderStore.isAmountExceedLimitBalance(
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
        const amounTaken = 2050.353;
        quantityValue = (amounTaken * 1.000001 / 5848.989).toFixed(8);
        priceValue = '5848.989';
        isSell = false;
        const isInvalid = uiOrderStore.isAmountExceedLimitBalance(
          isSell,
          quantityValue,
          priceValue,
          baseAssetBalance,
          amounTaken,
          3,
          8
        );
        expect(isInvalid).toBe(true);
      });
    });
  });
});
