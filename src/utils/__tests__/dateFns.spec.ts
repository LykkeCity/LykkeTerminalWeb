import dates from '../../constants/dateKeys';
import {
  convertMinutesToMs,
  convertMsToMinutes,
  convertMsToSeconds,
  convertSecondsToMs
} from '../dateFns';
import {dateFns} from '../index';

fdescribe('Bar request splitter', () => {
  const to = new Date().getTime();
  let from;
  let resolution;
  let periods;

  it('date functions should be defined', () => {
    expect(dateFns.splitter).toBeDefined();
    expect(true).toBe(true);
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
});
