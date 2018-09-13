import {timeParse} from 'd3-time-format';

import {
  mapToChartCandleModel,
  mapToChartCandleModelFromWamp
} from '../candleMapper';

const parseDate = timeParse('%Y-%m-%dT%H:%M:%SZ');

describe('candleMapper', () => {
  describe('method mapToChartCandleModel', () => {
    it('should return ready to use candle model', () => {
      const rawObject = {
        High: 1000,
        Low: 1000,
        Open: 1000,
        Close: 1000,
        Volume: 5000,
        OppositeVolume: 2000,
        DateTime: '2018-01-11T00:00:00Z'
      };

      const mappedCandle = mapToChartCandleModel(rawObject);

      expect(mappedCandle.close).toEqual(rawObject.Close);
      expect(mappedCandle.high).toEqual(rawObject.High);
      expect(mappedCandle.low).toEqual(rawObject.Low);
      expect(mappedCandle.open).toEqual(rawObject.Open);
      expect(mappedCandle.date).toEqual(parseDate(rawObject.DateTime));
      expect(mappedCandle.volume).toEqual(rawObject.Volume);
    });
  });

  describe('method mapToChartCandleModelFromWamp', () => {
    it('should return ready to use candle model', () => {
      const rawObject = {
        h: 1000,
        l: 1000,
        o: 1000,
        c: 1000,
        v: 5000,
        ov: 2000,
        t: '2018-01-11T00:00:00Z'
      };

      const mappedWampCandle = mapToChartCandleModelFromWamp(rawObject);

      expect(mappedWampCandle.close).toEqual(rawObject.c);
      expect(mappedWampCandle.high).toEqual(rawObject.h);
      expect(mappedWampCandle.low).toEqual(rawObject.l);
      expect(mappedWampCandle.open).toEqual(rawObject.o);
      expect(mappedWampCandle.date).toEqual(parseDate(rawObject.t));
      expect(mappedWampCandle.volume).toEqual(rawObject.v);
    });
  });
});
