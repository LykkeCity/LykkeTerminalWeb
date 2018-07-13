// tslint:disable-next-line:no-var-requires
const Big = require('big.js');

class BigNumberModel {
  private bigNumber: any;
  private calculationResult: string;

  get toString() {
    return this.calculationResult;
  }

  get toNumber() {
    return +this.calculationResult;
  }

  constructor(value: string | number) {
    this.bigNumber = this.calculationResult = new Big(value);
  }

  plus = (term: number | string) => {
    this.calculationResult = this.bigNumber.plus(term).valueOf();
    return this;
  };

  minus = (decrement: number | string) => {
    this.calculationResult = this.bigNumber.minus(decrement).valueOf();
    return this;
  };

  toFixed = (accuracy: number | string) => {
    this.calculationResult = this.bigNumber.toFixed(accuracy);
    return this;
  };
}

export default BigNumberModel;
