import {computed, observable, runInAction} from 'mobx';
import {add, pathOr} from 'rambda';
import {BalanceListApi} from '../api/index';
import {default as storageKeys} from '../constants/storageKeys';
import keys from '../constants/tradingWalletKeys';
import {AssetBalanceModel, BalanceModel} from '../models';
import MarketService from '../services/marketService';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const baseAssetStorage = StorageUtils(storageKeys.baseAsset);

class BalanceListStore extends BaseStore {
  @computed
  get getBalances() {
    return this.balanceLists
      .filter((b: BalanceModel) => !!b.balance)
      .sort((a: BalanceModel, b: BalanceModel) => b.balance - a.balance);
  }

  @computed
  get totalBalance() {
    return this.balanceLists.map(b => b.balance).reduce(add, 0);
  }

  @computed
  get tradingWalletAssets() {
    return this.tradingAssets.filter((a: AssetBalanceModel) => !!a.balance);
  }

  @computed
  get totalWalletAssetsBalance() {
    return this.tradingTotal;
  }

  @observable.shallow private balanceLists: any[] = [];
  @observable.shallow private tradingAssets: AssetBalanceModel[] = [];
  @observable private tradingTotal: number = 0;

  constructor(store: RootStore, private readonly api: BalanceListApi) {
    super(store);
  }

  fetchAll = () => {
    return this.api
      .fetchAll()
      .then((balanceListDto: any) => {
        runInAction(async () => {
          const tempBalanceLists = balanceListDto.map(
            (wallet: any) => new BalanceModel(wallet)
          );
          this.updateBalance(tempBalanceLists);
          this.setTradingAssets(tempBalanceLists);
        });
        return Promise.resolve();
      })
      .catch(Promise.reject);
  };

  updateBalance = async (
    tempBalanceLists: BalanceModel[] = this.balanceLists
  ) => {
    const promises = tempBalanceLists.map((balanceList: BalanceModel) => {
      return balanceList.updateBalance(this.rootStore.referenceStore);
    });
    await Promise.all(promises);
    this.balanceLists = [...tempBalanceLists];
  };

  setTradingAssets = async (balanceList: BalanceModel[]) => {
    this.tradingAssets = this.getTradingWallet(balanceList).balances.map(
      (assetsBalance: any) => {
        const assetBalance = new AssetBalanceModel(assetsBalance);
        const assetById = this.rootStore.referenceStore.getAssetById(
          assetBalance.id
        );
        assetBalance.name = pathOr('', ['name'], assetById);
        assetBalance.accuracy = pathOr('', ['accuracy'], assetById);
        return assetBalance;
      }
    );

    await this.updateTradingWallet();
  };

  updateTradingWallet = async () => {
    const assets = this.tradingAssets.map(asset => {
      return {
        AssetId: asset.id,
        Balance: asset.balance
      };
    });
    const baseAssetId = baseAssetStorage.get();

    const updatedBalances: any[] = await MarketService.updateQuotes(
      assets,
      baseAssetId
    );
    this.tradingTotal = updatedBalances.map(b => b.Balance).reduce(add, 0);
    this.tradingTotal += this.tradingAssets.find(
      a => a.id === baseAssetId
    )!.balance;
  };

  subscribe = (session: any) => {
    session.subscribe(`balances`, this.onUpdateBalance);
  };

  onUpdateBalance = async (args: any) => {
    const {a: asset, b: balance, r: reserved} = args[0];
    const assetBalance = this.tradingAssets.find(b => b.id === asset);
    if (assetBalance) {
      assetBalance.balance = balance;
      assetBalance.reserved = reserved;
    }
    this.updateTradingWallet();

    this.balanceLists.forEach((bl: BalanceModel) =>
      bl.balances.forEach(b => {
        if (b.AssetId === asset) {
          b.Balance = balance;
        }
      })
    );
    this.updateBalance(this.balanceLists);
  };

  reset = () => {
    this.balanceLists = [];
    this.tradingAssets = [];
  };

  private getTradingWallet = (balanceList: BalanceModel[]) => {
    return balanceList.find(b => b.type === keys.trading)!;
  };
}

export default BalanceListStore;
