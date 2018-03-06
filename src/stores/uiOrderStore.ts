import {StringHelpers} from '../utils/index';
import {BaseStore, RootStore} from './index';

class UiOrderStore extends BaseStore {
  constructor(store: RootStore) {
    super(store);
  }

  onArrowClick = (options: {
    field: string;
    operation: string;
    accuracy: number;
    value: string;
  }) => {
    const {field, operation, accuracy, value} = options;
    const tempObj = {};

    switch (operation) {
      case 'up':
        tempObj[field] = (
          parseFloat(value) + Math.pow(10, -1 * accuracy)
        ).toFixed(accuracy);
        break;
      case 'down':
        let newVal = parseFloat(value) - Math.pow(10, -1 * accuracy);
        newVal = newVal < 0 ? 0 : newVal;
        tempObj[field] = newVal.toFixed(accuracy);
        break;
    }

    return tempObj;
  };

  onValueChange = (options: {
    value: string;
    field: string;
    accuracy: number;
  }) => {
    let {value} = options;
    const {field, accuracy} = options;
    if (!StringHelpers.isOnlyNumbers(value)) {
      return;
    }
    value = StringHelpers.substringZero(value);
    value = StringHelpers.substringMinus(value);

    if (StringHelpers.getPostDecimalsLength(value) > accuracy) {
      value = StringHelpers.substringLast(value);
    }
    value = value === '' ? '0' : value;

    const tempObj = {};
    tempObj[field] = value;
    return tempObj;
  };

  fixedAmount = (
    currentPrice: number,
    quantityValue: string,
    accuracy: number
  ) => {
    const amount = currentPrice * parseFloat(quantityValue);
    return amount === 0 ? amount.toFixed(2) : amount.toFixed(accuracy);
  };

  // tslint:disable-next-line:no-empty
  reset = () => {};
}

export default UiOrderStore;
