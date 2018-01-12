import {Side} from '../index';

export const mapDtoToOrder = (x: any) => ({
  id: x.Id,
  price: x.Price,
  side: x.IsBuy ? Side.Sell : Side.Buy,
  timestamp: x.DateTime,
  volume: x.Volume
});
