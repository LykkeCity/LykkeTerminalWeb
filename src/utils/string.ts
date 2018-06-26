export const getPostDecimalsLength = (str: string) => {
  const postDecimals = str.split('.')[1];
  return postDecimals ? postDecimals.length : 0;
};

export const substringZero = (str: string) => {
  if (str[0] === '0' && str[1] !== '.' && str.length > 1) {
    return str.substring(1);
  }
  return str;
};

export const substringMinus = (str: string) => {
  if (str[0] === '-') {
    return str.substring(1);
  }
  return str;
};

export const substringLast = (str: string) => {
  const subStr = str.substring(0, str.length - 1);
  return subStr[subStr.length - 1] === '.'
    ? subStr.substring(0, subStr.length - 1)
    : subStr;
};

export const isOnlyNumbers = (str: any) => {
  str = str === '' ? 0 : str;
  return !isNaN(str - parseFloat(str));
};

export const getWampErrorMessage = (message: string) =>
  message
    .split(/(?=[A-Z])/)
    .join(' ')
    .toLowerCase();

export const getRestErrorMessage = (message: any) =>
  (Object as any).values(message)[0].join('. ');

export const toLocaleStringWithAccuracy = (
  num: number,
  accuracy: number,
  options?: any
) =>
  num.toLocaleString(undefined, {
    maximumFractionDigits: accuracy,
    ...options
  });

export const hasTrailingZeroes = (s: string) => s[s.length - 1] === '0';

export const getTrailingZeroOppositePosition = (s: string) => {
  const reversePosition = s
    .split('')
    .reverse()
    .findIndex((smb: string) => smb !== '0');
  return s.length - reversePosition;
};
