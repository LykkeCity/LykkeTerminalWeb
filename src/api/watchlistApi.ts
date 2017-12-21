export interface WatchlistApi {
  fetchAll: () => Promise<any[]>;
}

export class RestWatchlistApi implements WatchlistApi {
  fetchAll = () => Promise.resolve([]);
}

// tslint:disable-next-line:max-classes-per-file
export class MockWatchlistApi implements WatchlistApi {
  fetchAll = () =>
    Promise.resolve<any[]>([
      {
        id: '1',
        name: 'WL1',
        // tslint:disable-next-line:object-literal-sort-keys
        assets: [
          {id: '1', name: 'BTCUSD', bid: 16500, ask: 16700},
          {id: '2', name: 'BTCEUR', bid: 14320, ask: 14560},
          {id: '3', name: 'LKKUSD', bid: 1212, ask: 1313},
          {id: '4', name: 'LKKCHF', bid: 1211, ask: 1312}
        ]
      },
      {id: '2', name: 'WL2', assets: [{}, {}, {}]},
      {id: '3', name: 'WL3', assets: [{}, {}]},
      {id: '4', name: 'WL4', assets: [{}]}
    ]);
}

export default WatchlistApi;
