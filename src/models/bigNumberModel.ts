import Big from 'big.js';

class BigNumberModel {
  private bigNumber: Big;
  private calculationResult: string;

  constructor(value: string | number) {
    this.bigNumber = new Big(value);
    this.calculationResult = this.bigNumber.valueOf();
  }

  toString = () => {
    return this.calculationResult;
  };

  toNumber = () => {
    return parseFloat(this.calculationResult);
  };

  plus = (term: number | string) => {
    this.calculationResult = this.bigNumber.plus(term).valueOf();
    return this;
  };

  minus = (decrement: number | string) => {
    this.calculationResult = this.bigNumber.minus(decrement).valueOf();
    return this;
  };

  toFixed = (accuracy: number) => {
    this.calculationResult = this.bigNumber.toFixed(accuracy);
    return this;
  };

  times = (term: number) => {
    this.calculationResult = this.bigNumber.times(term).valueOf();
    return this;
  };

  pow = (times: number) => {
    this.calculationResult = this.bigNumber.pow(times).valueOf();
    return this;
  };
}

export default BigNumberModel;
