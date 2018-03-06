import dates from '../constants/dateKeys';

export const splitter = (from: number, to: number, resolution: string) => {
  const requestLimit = 4500;
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
