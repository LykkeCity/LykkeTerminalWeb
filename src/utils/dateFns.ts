import dates from '../constants/dateKeys';
import {chartInterval} from '../constants/priceChartConstants';

export const splitter = (from: number, to: number, resolution: string) => {
  const requestLimit = 5000;
  const resolutionNum = Number(resolution) || 1;
  const timePeriods: any[] = [];

  let duration;
  let timeDiff = to - from;
  let timeFullPeriod;
  let timePartialPeriod;
  let timePeriodsNumber;

  switch (resolution) {
    case '1':
    case '5':
    case '15':
    case '30':
    case '60':
    case '240':
    case '360':
    case '720':
      duration = timeDiff / dates.minute;
      break;
    case 'D':
    case '1D':
      duration = timeDiff / dates.day;
      break;
    case 'W':
    case '1W':
      duration = timeDiff / dates.week;
      break;
    case 'M':
    case '1M':
      duration = timeDiff / dates.month;
      break;

    default:
      return;
  }

  timePeriodsNumber = duration / resolutionNum / requestLimit;

  if (Math.ceil(timePeriodsNumber) > 1) {
    timeFullPeriod = Math.round(timeDiff / Math.floor(timePeriodsNumber));
    timePartialPeriod =
      timeDiff - timeFullPeriod * Math.floor(timePeriodsNumber);

    for (let i = 0; i < Math.ceil(timePeriodsNumber); i++) {
      timePeriods.push({
        from: from + timeFullPeriod * i,
        to:
          from +
          (timeDiff >= timeFullPeriod
            ? timeFullPeriod * (i + 1)
            : timeFullPeriod * i + timePartialPeriod)
      });

      timeDiff -= timeFullPeriod;
    }
  } else {
    timePeriods.push({
      from,
      to
    });
  }

  return timePeriods;
};

export const getTimeOffset = (offset: number) => {
  const absOffset = Math.abs(offset);
  return (
    (offset < 0 ? '+' : '-') +
    ('00' + Math.floor(absOffset / 60)).slice(-2) +
    ('00' + (absOffset % 60)).slice(-2)
  );
};

export const getTimeZone = (zones: any[]) => {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const gmt = getTimeOffset(new Date().getTimezoneOffset());

  let timezone =
    zones.find((z: any) => z.zone === zone) ||
    zones.find((z: any) => z.gmt === gmt) ||
    'Etc/UTC';

  timezone = typeof timezone === 'string' ? timezone : timezone.zone;

  return timezone;
};

export const convertSecondsToMs = (seconds: number) => seconds * 1000;
export const convertMsToSeconds = (ms: number) => ms / 1000;
export const convertMsToHours = (ms: number) => ms / 3600000;
export const convertHoursToMs = (ms: number) => ms * 3600000;
export const getDiffDays = (currentDate: number, previousDate: number) => {
  const timeDiff = Math.abs(currentDate - previousDate);
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const getChartFromDate = (interval: string, scale: number) => {
  let timeOffset = 0;
  const scaleMultiplier = 5;
  const timeUnitQty = chartInterval[interval].timeUnitQty;

  switch (interval) {
    case chartInterval.min5.value:
    case chartInterval.min15.value:
    case chartInterval.min30.value:
      timeOffset = dates.minute * scale;
      break;
    case chartInterval.hour.value:
    case chartInterval.hour4.value:
    case chartInterval.hour6.value:
    case chartInterval.hour12.value:
      timeOffset = dates.hour * scale;
      break;
    case chartInterval.day.value:
      timeOffset = dates.day * scale;
      break;
    case chartInterval.week.value:
      timeOffset = dates.week * scale;
      break;
    case chartInterval.month.value:
      timeOffset = dates.month * scale;
      break;
  }

  return timeOffset * timeUnitQty * scaleMultiplier;
};
