import {BigNumberModel} from '../index';

describe('BigNumberModel', () => {
  it('should add term to value', () => {
    const value = 1000;
    const term = 550;
    const resultNumber = 1550;
    const resultString = '1550';
    const bigNumber = new BigNumberModel(value).plus(term);

    expect(bigNumber.toNumber()).toBe(resultNumber);
    expect(bigNumber.toString()).toBe(resultString);
  });

  it('should subtract decrement from value', () => {
    const value = 3000;
    const decrement = 1300;
    const resultNumber = 1700;
    const resultString = '1700';
    const bigNumber = new BigNumberModel(value).minus(decrement);

    expect(bigNumber.toNumber()).toBe(resultNumber);
    expect(bigNumber.toString()).toBe(resultString);
  });

  it('should subtract decrement from value', () => {
    const value = 30.1234657;
    const accuracy = 3;
    const resultNumber = 30.123;
    const resultString = '30.123';
    const bigNumber = new BigNumberModel(value).toFixed(accuracy);

    expect(bigNumber.toNumber()).toBe(resultNumber);
    expect(bigNumber.toString()).toBe(resultString);
  });

  it('should multiply value', () => {
    const value = 10;
    const term = 3;
    const resultNumber = 30;
    const resultString = '30';
    const bigNumber = new BigNumberModel(value).times(term);

    expect(bigNumber.toNumber()).toBe(resultNumber);
    expect(bigNumber.toString()).toBe(resultString);
  });

  it('should subtract decrement from value', () => {
    const value = 300;
    const bigNumber = new BigNumberModel(value);
    const resultNumber = 300;
    const resultString = '300';

    expect(bigNumber.toNumber()).toBe(resultNumber);
    expect(bigNumber.toString()).toBe(resultString);
  });
});
