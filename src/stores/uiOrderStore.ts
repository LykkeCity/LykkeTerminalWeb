import {precisionFloor} from '../utils/math';
import {
  getPostDecimalsLength,
  isOnlyNumbers,
  substringLast,
  substringMinus,
  substringZero
} from '../utils/string';
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
    if (!isOnlyNumbers(value)) {
      return;
    }
    value = substringZero(value);
    value = substringMinus(value);

    if (getPostDecimalsLength(value) > accuracy) {
      value = substringLast(value);
    }
    value = value === '' ? '0' : value;

    const tempObj = {};
    tempObj[field] = value;
    return tempObj;
  };

  setActivePercentage = (percentage: any[], index?: number) => {
    let value: number = 0;

    if (index === undefined) {
      value = 100;
    }

    percentage.forEach((item: any, i: number) => {
      if (index === i) {
        item.isActive = true;
        value = item.percent;
      } else {
        item.isActive = false;
      }
    });

    return {
      value,
      updatedPercentage: percentage
    };
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
      value,
      currentPrice
    } = config;

    let quantityValue: any;
    if (isLimitActive) {
      if (isSellActive) {
        quantityValue = this.getPartlyValue(value, balance, quantityAccuracy);
      } else if (!isSellActive) {
        const convertedBalance = balance / currentPrice;
        quantityValue = this.getPartlyValue(
          value,
          convertedBalance,
          quantityAccuracy
        );
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
    if (quantityValue) {
      tempObj.quantityValue = quantityValue;
    }
    return tempObj;
  };

  getPartlyValue = (percent: number, balance: number, accuracy: number) => {
    return precisionFloor(percent / 100 * balance, accuracy);
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

  isLimitInvalid = (
    isSell: boolean,
    quantityValue: string,
    priceValue: string,
    baseAssetBalance: number,
    quoteAssetBalance: number,
    priceAccuracy: number,
    quantityAccuracy: number
  ) => {
    return (
      !+priceValue ||
      !+quantityValue ||
      this.isAmountExceedLimitBalance(
        isSell,
        quantityValue,
        priceValue,
        baseAssetBalance,
        quoteAssetBalance,
        priceAccuracy,
        quantityAccuracy
      )
    );
  };

  isMarketInvalid = (
    isSell: boolean,
    quantityValue: string,
    baseAssetId: string,
    quoteAssetId: string,
    baseAssetBalance: number,
    quoteAssetBalance: number,
    quantityAccuracy: number
  ) => {
    return (
      !+quantityValue ||
      this.isAmountExceedMarketBalance(
        isSell,
        quantityValue,
        baseAssetBalance,
        quoteAssetBalance,
        baseAssetId,
        quoteAssetId,
        quantityAccuracy
      )
    );
  };

  isAmountExceedMarketBalance = (
    isSell: boolean,
    quantityValue: string,
    baseAssetBalance: number,
    quoteAssetBalance: number,
    baseAssetId: string,
    quoteAssetId: string,
    quantityAccuracy: number
  ) => {
    const convertedBalance = this.rootStore.marketStore.convert(
      quoteAssetBalance,
      quoteAssetId,
      baseAssetId,
      this.rootStore.referenceStore.getInstrumentById
    );
    return isSell
      ? +quantityValue > baseAssetBalance
      : +quantityValue > precisionFloor(+convertedBalance, quantityAccuracy);
  };

  isAmountExceedLimitBalance = (
    isSell: boolean,
    quantityValue: string,
    priceValue: string,
    baseAssetBalance: number,
    quoteAssetBalance: number,
    priceAccuracy: number,
    quantityAccuracy: number
  ) =>
    isSell
      ? +quantityValue > baseAssetBalance
      : parseFloat(priceValue) *
          precisionFloor(parseFloat(quantityValue), quantityAccuracy) >
        quoteAssetBalance;

  // tslint:disable-next-line:no-empty
  reset = () => {};
}

export default UiOrderStore;
