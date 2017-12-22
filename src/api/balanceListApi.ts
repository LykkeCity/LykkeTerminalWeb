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
        balance: 5000,
        id: 1,
        profitAndLoss: 3,
        symbol: 'BTC',
        test: 123
      },
      {
        balance: 6500,
        id: 2,
        profitAndLoss: 5,
        symbol: 'BTC'
      }
    ]);
}

export default BalanceListApi;
