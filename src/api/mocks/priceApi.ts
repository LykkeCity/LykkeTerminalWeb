import randomNumber from '../../utils/randomNumber';
import PriceApi from '../priceApi';

const generateHistoryItem = (from: Date, to: Date) => {
  return {
    Close: randomNumber(1000, 2000),
    DateTime: randomNumber(from.valueOf(), to.valueOf()),
    High: randomNumber(1000, 2000),
    Low: randomNumber(1000, 2000),
    Open: randomNumber(1000, 2000),
    OppositeVolume: randomNumber(1000, 2000),
    Volume: randomNumber(1000, 2000)
  };
};

export class MockPriceApi implements PriceApi {
  fetchCandles = (
    instrument: string,
    from: Date,
    to: Date,
    interval: string
  ) => {
    const history = [];
    for (let i = 0; i < Math.floor(Math.random() * 10000); i++) {
      history.push(generateHistoryItem(from, to));
    }

    return Promise.resolve<any>({
      History: history
    });
  };
}

export default new MockPriceApi();
