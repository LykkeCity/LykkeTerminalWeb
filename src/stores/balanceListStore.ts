import {computed, observable, runInAction} from 'mobx';
import {add, pathOr} from 'rambda';
import {BalanceListApi} from '../api/index';
import {default as storageKeys} from '../constants/storageKeys';
import keys from '../constants/tradingWalletKeys';
import {AssetBalanceModel, WalletModel} from '../models';
import MarketService from '../services/marketService';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const baseAssetStorage = StorageUtils(storageKeys.baseAsset);

class BalanceListStore extends BaseStore {
  @computed
  get getWalletsWithPositiveBalances() {
    return this.walletList
      .filter(b => b.totalBalance > 0)
      .sort((a, b) => b.totalBalance - a.totalBalance);
  }

  @computed
  get totalBalance() {
    return this.walletList.map(b => b.totalBalance).reduce(add, 0);
  }

  @computed
  get availableBalance() {
    return this.tradingAssets.filter((a: AssetBalanceModel) => a.name);
  }

  @computed
  get tradingWalletAssets() {
    return this.tradingAssets.filter((a: AssetBalanceModel) => !!a.balance);
  }

  @computed
  get tradingWalletTotal() {
    return this.tradingTotal;
  }

  @computed
  get getCurrentWalletModel() {
    return this.currentWallet
      ? this.currentWallet
      : this.getWalletsWithPositiveBalances[0];
  }

  @observable.shallow private walletList: WalletModel[] = [];
  @observable.shallow private tradingAssets: AssetBalanceModel[] = [];
  @observable private tradingTotal: number = 0;
  @observable private currentWallet: WalletModel;

  constructor(store: RootStore, private readonly api: BalanceListApi) {
    super(store);
  }

  fetchAll = () => {
    return this.api
      .fetchAll()
      .then((resp: any) => {
        runInAction(() => {
          const balanceList = resp.map(
            (wallet: any) => new WalletModel(wallet)
          );
          this.updateBalance(balanceList);
          this.setTradingAssets(balanceList);
        });
        return Promise.resolve();
      })
      .catch(Promise.reject);
  };

  updateBalance = async (walletList: WalletModel[] = this.walletList) => {
    const promises = walletList.map(balanceList =>
      balanceList.update(this.rootStore.referenceStore)
    );
    await Promise.all(promises);
    this.walletList = [...walletList];
  };

  setTradingAssets = async (walletList: WalletModel[]) => {
    const notFoundAssets: string[] = [];
    const {getAssetById} = this.rootStore.referenceStore;
    this.tradingAssets = this.getTradingWallet(walletList).balances.map(
      (dto: any) => {
        const assetBalance = new AssetBalanceModel(dto);
        const assetById = getAssetById(assetBalance.id);
        if (!assetById) {
          notFoundAssets.push(assetBalance.id);
        }
        assetBalance.name = pathOr('', ['name'], assetById);
        assetBalance.accuracy = pathOr('', ['accuracy'], assetById);
        return assetBalance;
      }
    );

    await this.updateWithAssets(notFoundAssets);
    await this.updateTradingWallet();
  };

  selectWallet = async (index: number) => {
    this.currentWallet = this.getWalletsWithPositiveBalances[index];
  };

  updateWithAssets = async (ids: string[]) => {
    const promises: any = [];
    const {getAssetById, fetchAssetById} = this.rootStore.referenceStore;
    ids.forEach(id => {
      promises.push(fetchAssetById(id));
    });
    return Promise.all(promises).then(() => {
      ids.forEach(id => {
        this.tradingAssets.forEach(asset => {
          if (asset.id === id) {
            const assetById = getAssetById(asset.id);
            asset.name = pathOr('', ['name'], assetById);
            asset.accuracy = pathOr('', ['accuracy'], assetById);
          }
        });
      });
    });
  };

  updateTradingWallet = async () => {
    const assets = this.tradingAssets.map(asset => ({
      AssetId: asset.id,
      Balance: asset.balance
    }));
    const baseAssetId = baseAssetStorage.get();

    const updatedBalances: any[] = await MarketService.convert(
      assets,
      baseAssetId!
    );
    this.tradingAssets = this.tradingAssets.map(a => {
      const balanceInBaseAsset = pathOr(
        0,
        ['Balance'],
        updatedBalances.find(b => b.FromAssetId === a.id)
      );
      a.balanceInBaseAsset = balanceInBaseAsset;
      return a;
    });
    this.tradingTotal = updatedBalances.map(b => b.Balance).reduce(add, 0);
    const balanceInBaseAssetExists = this.tradingAssets.some(a =>
      this.eqToBaseAssetId(a, baseAssetId!)
    );
    if (balanceInBaseAssetExists) {
      const balancesInBaseAsset = this.tradingAssets.filter(a =>
        this.eqToBaseAssetId(a, baseAssetId!)
      );
      balancesInBaseAsset.forEach(b => (b.balanceInBaseAsset = b.balance));
      this.tradingTotal += balancesInBaseAsset
        .map(a => a.balance)
        .reduce(add, 0);
    }
  };

  subscribe = (session: any) => {
    session.subscribe(`balances`, this.onUpdateBalance);
  };

  onUpdateBalance = async () => {
    this.fetchAll();
  };

  reset = () => {
    this.walletList = [];
    this.tradingAssets = [];
  };

  private getTradingWallet = (walletList: WalletModel[]) => {
    return walletList.find(b => b.type === keys.trading)!;
  };

  private eqToBaseAssetId = (a: AssetBalanceModel, baseAssetId: string) =>
    a.id === baseAssetId;
}

export default BalanceListStore;
