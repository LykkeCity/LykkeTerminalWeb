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

  handlePercentageChange = async (config: any) => {
    const {
      isLimitActive = true,
      isSellActive,
      isMarketActive = false,
      balance,
      quantityAccuracy,
      priceAccuracy,
      isInverted,
      baseAssetId,
      quoteAssetId,
      percentage,
      index
    } = config;
    let value: number = 0;
    percentage.forEach((item: any, i: number) => {
      if (index === i) {
        item.isActive = true;
        value = item.percent;
      } else {
        item.isActive = false;
      }
    });

    let quantityValue: any;
    let priceValue: any;
    if (isLimitActive) {
      if (isSellActive) {
        quantityValue = this.getPartlyValue(value, balance, quantityAccuracy);
      } else if (!isSellActive) {
        priceValue = this.getPartlyValue(value, balance, priceAccuracy);
      }
    } else if (isMarketActive) {
      if (isSellActive) {
        if (!isInverted) {
          quantityValue = this.getPartlyValue(value, balance, quantityAccuracy);
        } else {
          const convertedBalance = this.rootStore.marketStore.convert(
            balance,
            baseAssetId,
            quoteAssetId,
            this.rootStore.referenceStore.getInstrumentById
          );
          quantityValue = this.getPartlyValue(
            value,
            convertedBalance,
            priceAccuracy
          );
        }
      } else {
        if (isInverted) {
          quantityValue = this.getPartlyValue(value, balance, priceAccuracy);
        } else {
          const convertedBalance = this.rootStore.marketStore.convert(
            balance,
            quoteAssetId,
            baseAssetId,
            this.rootStore.referenceStore.getInstrumentById
          );
          quantityValue = this.getPartlyValue(
            value,
            convertedBalance,
            quantityAccuracy
          );
        }
      }
    }
    const tempObj: any = {};
    if (priceValue) {
      tempObj.priceValue = priceValue;
    }
    if (quantityValue) {
      tempObj.quantityValue = quantityValue;
    }
    return {
      percentage,
      ...tempObj
    };
  };

  getPartlyValue = (percent: number, balance: number, accuracy: number) => {
    return (percent / 100 * balance).toFixed(accuracy);
  };

  updatePercentageState = (percentage: any[], index: number) => {
    let value: number = 0;
    percentage.forEach((item: any, i: number) => {
      if (index === i) {
        item.isActive = true;
        value = item.percent;
      } else {
        item.isActive = false;
      }
    });
    return value;
  };

  resetPercentage = (percentage: any[]) => {
    percentage.forEach((item: any) => {
      item.isActive = false;
    });
  };

  // tslint:disable-next-line:no-empty
  reset = () => {};
}

export default UiOrderStore;
