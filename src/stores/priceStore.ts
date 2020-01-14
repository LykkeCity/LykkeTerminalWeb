import {addDays, addMonths} from 'date-fns';
import {computed, observable, runInAction} from 'mobx';
import {last} from 'rambda';
import {BaseStore, RootStore} from '.';
import {PriceApi} from '../api';
import messages from '../constants/notificationMessages';
import {levels} from '../models';
import {MarketDataModel, PriceType} from '../models';
import * as map from '../models/mappers';
import {DocumentService} from '../services/documentService';
const toUtc = (date: Date) => {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  return new Date(Date.UTC(y, m, d));
};

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

  constructor(store: RootStore, private readonly api: PriceApi) {
    super(store);
  }

  fetchLastPrice = async () => {
    return this.api
      .fetchCandles(
        this.selectedInstrument!.id,
        PriceType.Trade,
        toUtc(addMonths(new Date(), -12)),
        toUtc(addMonths(new Date(), 1)),
        'month'
      )
      .then((resp: any) => {
        if (resp.History && resp.History.length > 0) {
          runInAction(() => {
            const {close} = map.mapToBarFromRest(last(resp.History));
            this.lastTradePrice = close;
            this.selectedInstrument!.updateFromCandle(
              undefined,
              close,
              undefined
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

  fetchDailyCandle = async () => {
    const resp = await this.api.fetchCandles(
      this.selectedInstrument!.id,
      PriceType.Trade,
      toUtc(new Date()),
      toUtc(addDays(new Date(), 1)),
      'day'
    );
    if (resp.History && resp.History.length > 0) {
      runInAction(() => {
        const {open, high, low, close, volume} = map.mapToBarFromRest(
          last(resp.History)
        );
        this.dailyOpen = open;
        this.dailyHigh = high;
        this.dailyLow = low;
        this.dailyVolume = volume;
        this.dailyChange = this.computeDailyChange;

        this.selectedInstrument!.updateFromCandle(open, close, volume);
        this.selectedInstrument!.updateVolumeInBase(
          this.rootStore.marketStore.convert(
            volume,
            this.selectedInstrument!.baseAsset.id,
            this.rootStore.referenceStore.baseAssetId,
            this.rootStore.referenceStore.getInstrumentById
          )
        );
        DocumentService.updateDocumentTitle(this.selectedInstrument!);
      });
    }
  };

  updatePrices = (data: MarketDataModel) => {
    if (
      this.selectedInstrument &&
      this.selectedInstrument.id === data.AssetPairId
    ) {
      this.dailyHigh = data.High;
      this.dailyLow = data.Low;
      this.lastTradePrice = data.LastPrice;
      this.dailyVolume = data.VolumeBase;
      this.dailyChange = data.PriceChange;
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
