import randomNumber from '../../utils/randomNumber';
import OrderApi from '../orderApi';

const generateOrders = () => {
  const orders = [];
  const count = Math.floor(Math.random() * 10);

  for (let i = 0; i < count; i++) {
    orders.push({
      AssetPairId: 'BTCUSD',
      CreateDateTime: new Date().valueOf() + i,
      Id: `${i.toString()}${(
        new Date().valueOf() + i
      ).toLocaleString()}${Math.random()}`,
      LowerLimitPrice: null,
      LowerPrice: null,
      OrderAction: Math.random() % 2 === 0 ? 'Buy' : 'Sell',
      Price: randomNumber(1000, 2000),
      RemainingVolume: randomNumber(1000, 2000),
      Status: 'Placed',
      Type: 'Limit',
      UpperLimitPrice: null,
      UpperPrice: null,
      Volume: randomNumber(1000, 2000)
    });
    orders.push({
      AssetPairId: 'BTCUSD',
      CreateDateTime: new Date().valueOf() + i,
      Id: `${i.toString()}${(
        new Date().valueOf() + i
      ).toLocaleString()}${Math.random()}`,
      LowerLimitPrice: null,
      LowerPrice: null,
      OrderAction: Math.random() % 2 === 0 ? 'Buy' : 'Sell',
      Price: randomNumber(1000, 2000),
      RemainingVolume: randomNumber(1000, 2000),
      Status: 'Placed',
      Type: 'Market',
      UpperLimitPrice: null,
      UpperPrice: null,
      Volume: randomNumber(1000, 2000)
    });
  }

  return orders;
};

export class MockOrderApi implements OrderApi {
  placeMarket = () => Promise.resolve();

  placeLimit = () => Promise.resolve();

  cancelOrder = () => Promise.resolve();

  cancelAllOrders = () => Promise.resolve();

  fetchAll = () => Promise.resolve<any>(generateOrders());
}
export default new MockOrderApi();
