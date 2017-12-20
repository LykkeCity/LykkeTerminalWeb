export interface BalanceListApi {
  fetchAll: () => Promise<any[]>;
}

export class RestBalanceListApi implements BalanceListApi {
  fetchAll = () => Promise.resolve([]);
}

// tslint:disable-next-line:max-classes-per-file
export class MockBalanceListApi implements BalanceListApi {
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
