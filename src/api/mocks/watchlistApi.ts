import {WatchlistApi} from '../watchlistApi';

export class MockWatchlistApi implements WatchlistApi {
  fetchAll = () =>
    Promise.resolve<any[]>([
      {
        Id: '284816c3-037d-4678-aaac-61311d6fe03a',
        Name: 'All assets',
        AssetPairIds: [
          'BTCCHF',
          'BTCEUR',
          'BTCGBP',
          'BTCLKK',
          'BTCUSD',
          'ETHBTC',
          'ETHCHF',
          'ETHLKK',
          'ETHUSD',
          'EURCHF',
          'EURGBP',
          'EURUSD',
          'GBPCHF',
          'GBPUSD',
          'LKKCHF',
          'LKKEUR',
          'LKKGBP',
          'LKKUSD',
          'USDCHF'
        ],
        Order: 0,
        ReadOnlyProperty: true
      },
      {
        Id: 'f4d4cb3a-389f-4ad9-a2db-0607b9288a91',
        Name: 'ETH',
        AssetPairIds: ['ETHBTC', 'ETHCHF', 'ETHGBP', 'ETHLKK', 'ETHUSD'],
        Order: 0,
        ReadOnlyProperty: true
      },
      {
        Id: '6270507d-6a4a-4f67-aa9e-ab8356565219',
        Name: 'BTC',
        AssetPairIds: ['BTCCHF', 'BTCEUR', 'BTCGBP', 'BTCLKK', 'BTCUSD'],
        Order: 100,
        ReadOnlyProperty: true
      }
    ]);
}
export default new MockWatchlistApi();
