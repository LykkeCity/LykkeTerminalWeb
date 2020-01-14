import {computed, observable, runInAction} from 'mobx';
import {BaseStore, RootStore} from '.';
import {AssetApi} from '../api/index';
import {MarketDataModel} from '../models';
import {DocumentService} from '../services/documentService';

class PriceStore extends BaseStore {
  priceApi: any;
  @observable lastTradePrice: number;
  @observable dailyHigh: number;
  @observable dailyLow: number;
  @observable dailyOpen: number;
  @observable dailyVolume: number;
  @observable dailyChange: number;

  @computed
  get computeDailyChange() {
    return ((this.lastTradePrice - this.dailyOpen) / this.dailyOpen) * 100;
  }

  @computed
  get selectedInstrument() {
    return this.rootStore.uiStore.selectedInstrument;
  }

  @computed
  get selectedPriceType() {
    return this.rootStore.uiStore.selectedPriceType;
  }

  constructor(store: RootStore, private api: AssetApi) {
    super(store);
  }

  fetchLastPrice = async () => {
    const data = await this.api.fetchMarket(this.selectedInstrument!.id);
    runInAction(() => {
      this.lastTradePrice = data.LastPrice;
      this.dailyHigh = data.High;
      this.dailyLow = data.Low;
      this.lastTradePrice = data.LastPrice;
      this.dailyVolume = data.Volume24H;
      this.dailyChange = data.PriceChange24H * 100;
    });
    DocumentService.updateDocumentTitle(this.selectedInstrument!);
  };

  updateFromMarketWamp = (data: MarketDataModel) => {
    if (
      this.selectedInstrument &&
      this.selectedInstrument.id === data.AssetPairId
    ) {
      runInAction(() => {
        this.dailyHigh = data.High;
        this.dailyLow = data.Low;
        this.lastTradePrice = data.LastPrice;
        this.dailyVolume = data.VolumeBase;
        this.dailyChange = data.PriceChange * 100;
      });
      DocumentService.updateDocumentTitle(this.selectedInstrument!);
    }
  };

  updateFromMarketApi = (data: any) => {
    if (
      this.selectedInstrument &&
      this.selectedInstrument.id === data.AssetPair
    ) {
      runInAction(() => {
        this.lastTradePrice = data.LastPrice;
        this.dailyHigh = data.High;
        this.dailyLow = data.Low;
        this.lastTradePrice = data.LastPrice;
        this.dailyVolume = data.Volume24H;
        this.dailyChange = data.PriceChange24H * 100;
      });
      DocumentService.updateDocumentTitle(this.selectedInstrument!);
    }
  };

  reset = () => {
    this.lastTradePrice = 0;
    this.dailyHigh = 0;
    this.dailyLow = 0;
    this.dailyOpen = 0;
    this.dailyVolume = 0;
    this.dailyChange = 0;
  };
}

export default PriceStore;
