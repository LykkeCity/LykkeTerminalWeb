import {action, runInAction} from 'mobx';
import {add, pathOr} from 'rambda';
import {BalanceListApi} from '../api/index';
import * as topics from '../api/topics';
import {AssetBalanceModel, keys, WalletModel, WalletType} from '../models';
import {ApiWalletModel} from '../models/walletModel';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const tradingWalletStorage = StorageUtils(keys.tradingWallet);

class BalanceListStore extends BaseStore {
  tradingWallet: WalletModel;

  constructor(store: RootStore, private readonly api: BalanceListApi) {
    super(store);

    this.tradingWallet = new WalletModel({
      Id: 'Trading',
      Name: 'Trading',
      Balances: [],
      Type: 'Trading'
    });
  }

  hasFundsOnBalance = () =>
    this.tradingWallet.balances.map(wallet => wallet.balance).reduce(add, 0) >
    0;

  getTotalBalance = () =>
    this.tradingWallet ? this.tradingWallet.totalBalance : 0;

  getTotalBalanceInBaseAsset = () =>
    this.tradingWallet ? this.tradingWallet.totalBalanceInBaseAsset : 0;

  fetchAll = () => {
    return this.api
      .fetchAll()
      .then((resp: any) => {
        runInAction(() => {
          this.tradingWallet = resp
            .map((wallet: ApiWalletModel) => new WalletModel(wallet))
            .find((wallet: WalletModel) => wallet.type === WalletType.Trading);
          tradingWalletStorage.set(JSON.stringify(this.tradingWallet));
        });
        return Promise.resolve();
      })
      .catch(() => {
        if (this.rootStore.apiStore.getUseCacheData()) {
          this.setWalletFromCache();
        }
      });
  };

  @action
  updateWalletBalances = async () => {
    this.tradingWallet.balances.forEach(this.updateBalance);
    tradingWalletStorage.set(JSON.stringify(this.tradingWallet));
  };

  updateBalance = async (assetBalance: AssetBalanceModel) => {
    const {
      baseAssetId,
      getInstrumentById,
      getAssetById,
      fetchAssetById
    } = this.rootStore.referenceStore;
    const {balance, id} = assetBalance;

    let asset = getAssetById(id);

    if (!asset) {
      asset = await fetchAssetById(id);
    }

    assetBalance.name = pathOr('', ['name'], asset);
    assetBalance.accuracy = pathOr('', ['accuracy'], asset);

    assetBalance.balanceInBaseAsset = this.rootStore.marketStore.convert(
      balance,
      id,
      baseAssetId,
      getInstrumentById
    );
    tradingWalletStorage.set(JSON.stringify(this.tradingWallet));
  };

  subscribe = (session: any) => {
    session.subscribe(topics.balances, this.onUpdateBalance);
  };

  onUpdateBalance = async (args: any) => {
    const dto = args[0];
    const {id, a, b, r} = dto;
    if (this.tradingWallet && this.tradingWallet.id === id) {
      const balance = this.tradingWallet.balances.find(
        (bc: AssetBalanceModel) => bc.id === a
      );
      if (balance) {
        balance.balance = b;
        balance.reserved = r;
      } else {
        const newBalanceModel = new AssetBalanceModel({
          AssetId: a,
          Balance: b,
          Reserved: r
        });

        this.updateBalance(newBalanceModel);
        this.tradingWallet.balances.push(newBalanceModel);
      }

      tradingWalletStorage.set(JSON.stringify(this.tradingWallet));
    }
  };

  reset = () => {
    this.tradingWallet.balances = [];
  };

  private setWalletFromCache = () => {
    const cachedWalletModel = JSON.parse(tradingWalletStorage.get()!);
    this.tradingWallet = Object.assign(
      new WalletModel({
        Name: '',
        Id: '',
        Balances: [],
        Type: ''
      }),
      cachedWalletModel
    );
    this.tradingWallet.balances = this.tradingWallet.balances.map(balance =>
      Object.assign(new AssetBalanceModel({}), balance)
    );
  };
}

export default BalanceListStore;
