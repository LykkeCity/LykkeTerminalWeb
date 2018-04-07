import {formattedDate, formattedNumber} from './localFormatted';

const results = {
  'en-US': {
    expectNumber: '50,000.05',
    expectNumberWithAccuracy: '50,000.0500',
    expectDate: '12/17/1995'
  }
};

describe('Test locale for number and date', () => {
  const date = new Date(Date.UTC(1995, 11, 17, 3, 24, 0));
  const locale = navigator.language;
  if (locale === 'en-US') {
    it('should return string number with locale', () => {
      expect(formattedNumber(50000.05)).toBe(results[locale].expectNumber);
      expect(formattedNumber('50000.05')).toBe(results[locale].expectNumber);
      expect(formattedNumber('50000.05', 4)).toBe(
        results[locale].expectNumberWithAccuracy
      );
    });

    it('should return string date with locale', () => {
      expect(formattedDate(date)).toBe(results[locale].expectDate);
    });
  }
});
