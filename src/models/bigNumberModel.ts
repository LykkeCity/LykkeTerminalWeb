class BigNumberModel {
  string: string;

  get number() {
    return parseFloat(this.string);
  }

  constructor(value: 'string') {
    this.string = value;
  }
}

export default BigNumberModel;
