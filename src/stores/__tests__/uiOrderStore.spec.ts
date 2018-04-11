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
    ).toBe(
      (currentPrice * parseFloat(quantityValue)).toLocaleString(undefined, {
        maximumFractionDigits: accuracy
      })
    );
  });

  it('should return object with fixed value', () => {
    accuracy = 3;
    const gottenObject = uiOrderStore.onValueChange({field, accuracy, value});
    expect(gottenObject![field]).toBe(value);
  });
});
