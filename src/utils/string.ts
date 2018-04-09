class StringHelpers {
  static getPostDecimalsLength(str: string) {
    const postDecimals = str.split('.')[1];
    return postDecimals ? postDecimals.length : 0;
  }

  static substringZero(str: string) {
    if (str[0] === '0' && str[1] !== '.') {
      return str.substring(1);
    }
    return str;
  }

  static substringMinus(str: string) {
    if (str[0] === '-') {
      return str.substring(1);
    }
    return str;
  }

  static substringLast(str: string) {
    const subStr = str.substring(0, str.length - 1);
    return subStr[subStr.length - 1] === '.'
      ? subStr.substring(0, subStr.length - 1)
      : subStr;
  }

  static isOnlyNumbers(str: any) {
    str = str === '' ? 0 : str;
    return !isNaN(str - parseFloat(str));
  }
}

export default StringHelpers;

export const toLocaleStringWithAccuracy = (num: number, accuracy: number) =>
  num.toLocaleString(undefined, {
    maximumFractionDigits: accuracy
  });
