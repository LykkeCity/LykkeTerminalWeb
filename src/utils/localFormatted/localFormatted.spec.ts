import {
  formattedDate,
  formattedDateTime,
  formattedNumber,
  formattedTime
} from './localFormatted';

const results = {
  'en-US': {
    expectNumber: '50,000.05',
    expectNumberWithAccuracy: '50,000.0500',
    expectDateTime: '12/17/1995, 3:24:00 AM',
    expectDate: '12/17/1995',
    expectTime: '3:24:00 AM'
  }
};

describe('Test locale for number and datetime', () => {
  const dateTime = new Date(Date.UTC(1995, 11, 17, 3, 24, 0));
  const locale = navigator.language;
  if (locale === 'en-US') {
    it('should return string number with locale', () => {
      expect(formattedNumber(50000.05)).toBe(results[locale].expectNumber);
      expect(formattedNumber('50000.05')).toBe(results[locale].expectNumber);
      expect(formattedNumber('50000.05', 4)).toBe(
        results[locale].expectNumberWithAccuracy
      );
    });

    it('should return string dateTime with locale', () => {
      expect(formattedDateTime(dateTime)).toBe(results[locale].expectDateTime);
    });

    it('should return string date with locale', () => {
      expect(formattedDate(dateTime)).toBe(results[locale].expectDate);
    });

    it('should return string time with locale', () => {
      expect(formattedTime(dateTime)).toBe(results[locale].expectTime);
    });
  }
});
