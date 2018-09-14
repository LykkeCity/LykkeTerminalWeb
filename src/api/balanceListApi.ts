import mockBalanceListApi from './mocks/balanceListApi';
import RestApi from './restApi';

export interface BalanceListApi {
  fetchAll: () => Promise<{[key: string]: any}>;
}

export class RestBalanceListApi extends RestApi implements BalanceListApi {
  fetchAll = () =>
    this.extendWithMocks(
      () => this.get('/wallets/balances'),
      () => mockBalanceListApi.fetchAll()
    );
}

export default BalanceListApi;
