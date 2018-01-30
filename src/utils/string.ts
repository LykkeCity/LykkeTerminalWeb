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

  static substringLast(str: string) {
    const subStr = str.substring(0, str.length - 1);
    return subStr[subStr.length - 1] === '.'
      ? subStr.substring(0, subStr.length - 1)
      : subStr;
  }

  static isOnlyNumbers(str: string) {
    return /^(?:[1-9]\d*|0)?(?:\.\d+)?$/g.test(str);
  }
}

export default StringHelpers;
