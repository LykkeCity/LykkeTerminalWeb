import mockBalanceListApi from './mocks/balanceListApi';
import RestApi from './restApi';

export interface BalanceListApi {
  fetchAll: () => Promise<{[key: string]: any}>;
}

export class RestBalanceListApi extends RestApi implements BalanceListApi {
  fetchAll = (onRefetch?: any) =>
    this.extendForOffline(
      () => this.get('/wallets/balances'),
      () => mockBalanceListApi.fetchAll(),
      () => onRefetch()
    );
}

export default BalanceListApi;
