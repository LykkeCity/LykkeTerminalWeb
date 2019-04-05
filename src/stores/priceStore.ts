import {computed, observable, runInAction} from 'mobx';
import {BaseStore, RootStore} from '.';
import {PriceApi} from '../api';
import messages from '../constants/notificationMessages';
import {levels} from '../models';
import {DocumentService} from '../services/documentService';

class PriceStore extends BaseStore {
  priceApi: any;
  @observable lastTradePrice: number;
  @observable dailyHigh: number;
  @observable dailyLow: number;
  @observable dailyVolume: number;
  @observable dailyChange: number;

  @computed
  get selectedInstrument() {
    return this.rootStore.uiStore.selectedInstrument;
  }

  @computed
  get selectedPriceType() {
    return this.rootStore.uiStore.selectedPriceType;
  }

  constructor(store: RootStore, private readonly api: PriceApi) {
    super(store);
  }

  fetchDailyData = async () => {
    return this.api
      .fetchDailyData(this.selectedInstrument!.id)
      .then((resp: any) => {
        if (resp) {
          runInAction(() => {
            this.dailyHigh = resp.High;
            this.dailyLow = resp.Low;
            this.dailyVolume = resp.Volume24H;
            this.dailyChange = resp.PriceChange24H;
            this.lastTradePrice = resp.LastPrice;

            this.selectedInstrument!.updateFromCandle(
              this.dailyChange,
              this.lastTradePrice,
              this.dailyVolume
            );
            this.selectedInstrument!.updateVolumeInBase(
              this.rootStore.marketStore.convert(
                this.dailyVolume,
                this.selectedInstrument!.baseAsset.id,
                this.rootStore.referenceStore.baseAssetId,
                this.rootStore.referenceStore.getInstrumentById
              )
            );
            DocumentService.updateDocumentTitle(this.selectedInstrument!);
          });
        }
      })
      .catch((e: any) => {
        switch (e.status) {
          case 404:
            this.rootStore.notificationStore.addNotification(
              levels.error,
              messages.pairNotConfigured(this.selectedInstrument!.id)
            );
            break;
          default:
            break;
        }
      });
  };

  reset = () => {
    this.lastTradePrice = 0;
    this.dailyHigh = 0;
    this.dailyLow = 0;
    this.dailyVolume = 0;
  };
}

export default PriceStore;
