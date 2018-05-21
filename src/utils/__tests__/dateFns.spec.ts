import {timeZones} from '../../constants/chartTimezones';
import dates from '../../constants/dateKeys';
import {
  convertMinutesToMs,
  convertMsToMinutes,
  convertMsToSeconds,
  convertSecondsToMs,
  getDiffDays
} from '../dateFns';
import {dateFns} from '../index';

describe('Date functions', () => {
  describe('Bar request splitter', () => {
    const to = new Date().getTime();
    let from;
    let resolution;
    let periods;

    it('date splitter function should be defined', () => {
      expect(dateFns.splitter).toBeDefined();
    });

    it('splitter should return only one object in array for 5 minutes resolution and 1 week time interval', () => {
      from = new Date().getTime() - dates.week;
      resolution = '5';

      periods = dateFns.splitter(from, to, resolution);

      expect(periods instanceof Array).toBeTruthy();
      expect(periods!.length).toBe(1);
      expect(periods![0].from).toBe(from);
      expect(periods![0].to).toBe(to);
    });

    it('splitter should return several objects in array for 1 minute resolution and 1 week time interval', () => {
      from = new Date().getTime() - dates.week;
      resolution = '1';

      periods = dateFns.splitter(from, to, resolution);

      expect(periods instanceof Array).toBeTruthy();
      expect(periods!.length).toBeGreaterThan(1);
      expect(periods![0].from).toBe(from);
      expect(periods![periods!.length - 1].to).toBe(to);
    });

    it('splitter should return several objects in array for 1 day resolution and 15 years time interval', () => {
      from = new Date().getTime() - dates.year * 15;
      resolution = 'D';

      periods = dateFns.splitter(from, to, resolution);

      expect(periods instanceof Array).toBeTruthy();
      expect(periods!.length).toBeGreaterThan(1);
      expect(periods![0].from).toBe(from);
      expect(periods![periods!.length - 1].to).toBe(to);
    });
  });

  describe('Get time offset', () => {
    const offset: any = {
      plus: {minutes: 240, gmt: '-0400'},
      minus: {minutes: -120, gmt: '+0200'}
    };
    let timezone: string;

    it('date getTimeOffset function should be defined', () => {
      expect(dateFns.getTimeOffset).toBeDefined();
    });

    it('getTimeOffset should return GMT +04', () => {
      timezone = dateFns.getTimeOffset(offset.plus.minutes);

      expect(timezone).toBe(offset.plus.gmt);
    });

    it('getTimeOffset should return GMT -02', () => {
      timezone = dateFns.getTimeOffset(offset.minus.minutes);

      expect(timezone).toBe(offset.minus.gmt);
    });
  });

  describe('Get timezone from list by calculated offset', () => {
    const timezones = [
      'America/New_York',
      'America/Los_Angeles',
      'America/Chicago',
      'America/Phoenix',
      'America/Toronto',
      'America/Vancouver',
      'America/Argentina/Buenos_Aires',
      'America/Sao_Paulo',
      'America/Bogota',
      'America/Caracas',
      'America/Mexico_City',
      'Europe/Moscow',
      'Europe/Athens',
      'Europe/Berlin',
      'Europe/London',
      'Europe/Madrid',
      'Europe/Paris',
      'Europe/Warsaw',
      'Europe/Istanbul',
      'Europe/Zurich',
      'Australia/Sydney',
      'Australia/Brisbane',
      'Australia/Adelaide',
      'Asia/Almaty',
      'Asia/Ashkhabad',
      'Asia/Tokyo',
      'Asia/Taipei',
      'Asia/Singapore',
      'Asia/Shanghai',
      'Asia/Seoul',
      'Asia/Tehran',
      'Asia/Dubai',
      'Asia/Kolkata',
      'Asia/Hong_Kong',
      'Asia/Bangkok',
      'Pacific/Chatham',
      'Pacific/Honolulu',
      'Etc/UTC'
    ];
    let timezone: string;
    let equalTimezone: string | undefined;

    it('date getTimeZone function should be defined', () => {
      expect(dateFns.getTimeZone).toBeDefined();
    });

    it('getTimeZone should return correct timezone from list', () => {
      timezone = dateFns.getTimeZone(timeZones);
      equalTimezone = timezones.find(t => t === timezone);

      expect(equalTimezone).toBeDefined();
      expect(typeof equalTimezone).toBe('string');
    });

    it("getTimeZone should return 'Etc/UTC' if there are no equal timezone in the list", () => {
      timezone = dateFns.getTimeZone([
        {zone: 'Antarctica/Vostok', gmt: '+1200'}
      ]);

      expect(timezone).toBe('Etc/UTC');
    });
  });

  it('should convert seconds to milliseconds', () => {
    const seconds = 1;
    expect(convertSecondsToMs(seconds)).toBe(seconds * 1000);
  });

  it('should convert milliseconds to seconds', () => {
    const milliseconds = 1000;
    expect(convertMsToSeconds(milliseconds)).toBe(milliseconds / 1000);
  });

  it('should convert milliseconds to minutes', () => {
    const milliseconds = 120000;
    expect(convertMsToMinutes(milliseconds)).toBe(milliseconds / 60000);
  });

  it('should convert minutes to milliseconds', () => {
    const minutes = 2;
    expect(convertMinutesToMs(minutes)).toBe(minutes * 60000);
  });

  it('should return 0 as no difference between two dates in days', () => {
    const currentDate = new Date().getTime();
    const previousDate = new Date().getTime();
    expect(getDiffDays(currentDate, previousDate)).toBe(0);
  });

  it('should return difference between two days', () => {
    const oneDay = 24 * 60 * 60 * 1000;
    const currentDate = new Date().getTime();
    const previousDate = new Date().getTime() - oneDay;
    expect(getDiffDays(currentDate, previousDate)).toBe(1);
  });

  describe('Update from date to limit chart candles', () => {
    const to = new Date().getTime();
    const from = new Date().getTime() - dates.week * 5.5;
    const updatedFromOptions = {
      '1': to - dates.day,
      '5': to - dates.day * 2,
      '15': to - dates.week,
      '30': to - dates.week * 1.5,
      '60': to - dates.week * 3,
      '360': to - dates.month * 6,
      '720': to - dates.month * 7,
      '1D': to - dates.year * 1.5
    };
    let resolution;

    it('date candlesLimit function should be defined', () => {
      expect(dateFns.candlesLimit).toBeDefined();
    });

    it('range for 1 minute resolution should starts from 1 day before now', () => {
      resolution = '1';
      expect(dateFns.candlesLimit(from, to, resolution)).toBe(
        updatedFromOptions[1]
      );
    });

    it('range for 5 minutes resolution should starts from 2 days before now', () => {
      resolution = '5';
      expect(dateFns.candlesLimit(from, to, resolution)).toBe(
        updatedFromOptions[5]
      );
    });

    it('range for 15 minutes resolution should starts from 1 week before now', () => {
      resolution = '15';
      expect(dateFns.candlesLimit(from, to, resolution)).toBe(
        updatedFromOptions[15]
      );
    });

    it('range for 30 minutes resolution should starts from 1.5 weeks before now', () => {
      resolution = '30';
      expect(dateFns.candlesLimit(from, to, resolution)).toBe(
        updatedFromOptions[30]
      );
    });

    it('range for 60 minutes resolution should starts from 3 weeks before now', () => {
      resolution = '60';
      expect(dateFns.candlesLimit(from, to, resolution)).toBe(
        updatedFromOptions[60]
      );
    });

    it('range for 360 minutes resolution should starts from 6 months before now', () => {
      resolution = '360';
      expect(dateFns.candlesLimit(from, to, resolution)).toBe(
        updatedFromOptions[360]
      );
    });

    it('range for 720 minutes resolution should starts from 7 months before now', () => {
      resolution = '720';
      expect(dateFns.candlesLimit(from, to, resolution)).toBe(
        updatedFromOptions[720]
      );
    });

    it('range for 1 day resolution should starts from 1.5 years before now', () => {
      resolution = '1D';
      expect(dateFns.candlesLimit(from, to, resolution)).toBe(
        updatedFromOptions['1D']
      );
    });

    it('range for 1 week resolution should return from parameter as is', () => {
      resolution = '1W';
      expect(dateFns.candlesLimit(from, to, resolution)).toBe(from);
    });
  });
});
