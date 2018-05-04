import RestApi from './restApi';

export interface BalanceListApi {
  fetchAll: () => Promise<{[key: string]: any}>;
}

export class RestBalanceListApi extends RestApi implements BalanceListApi {
  fetchAll = () => this.get('/wallets/balances');
}

// tslint:disable-next-line:max-classes-per-file
export class MockBalanceListApi extends RestApi implements BalanceListApi {
  fetchAll = () =>
    Promise.resolve<any[]>([
      {
        ApiKey: null,
        Balances: [
          {AssetId: 'BTC', Balance: 200, Reserved: 20},
          {AssetId: 'GBP', Balance: 1279, Reserved: 211},
          {AssetId: 'USD', Balance: 3107, Reserved: 0}
        ],
        Description: 'Default trading wallet',
        Id: '0269b387-09de-40f0-b6a8-ca2950576ac0',
        Name: 'Trading Wallet',
        Type: 'Trading'
      },
      {
        ApiKey: '11d82e30-31de-4005-bc05-9701fd1340ac',
        Balances: [{AssetId: 'BTC', Balance: 0.35, Reserved: 0.12}],
        Description: 'No description',
        Id: '03f71ce1-31e4-4c64-be33-06e4e1ff4327',
        Name: 'QWERTY',
        Type: 'Trusted'
      }
    ]);
}

// tslint:disable-next-line:max-classes-per-file
export class MockBalanceListApiNullBalance extends RestApi
  implements BalanceListApi {
  fetchAll = () =>
    Promise.resolve<any[]>([
      {
        ApiKey: null,
        Balances: [
          {AssetId: 'BTC', Balance: 0, Reserved: 0},
          {AssetId: 'GBP', Balance: 0, Reserved: 0},
          {AssetId: 'USD', Balance: 0, Reserved: 0}
        ],
        Description: 'Default trading wallet',
        Id: '0269b387-09de-40f0-b6a8-ca2950576ac0',
        Name: 'Trading Wallet',
        Type: 'Trading'
      }
    ]);
}

export default BalanceListApi;
