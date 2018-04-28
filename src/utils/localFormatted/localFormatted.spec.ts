import {formattedNumber} from './localFormatted';

const locale = 'en-US';
const results = {
  [locale]: {
    expectNumber: '50,000.050',
    expectNumberWithAccuracy: '50,000.050'
  }
};

describe('Test locale for number and date', () => {
  it('should return string number with locale', () => {
    expect(formattedNumber(50000.05, 2)).toBe(results[locale].expectNumber);
  });
});
