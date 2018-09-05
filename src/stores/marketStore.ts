import {buildDijkstra} from '@lykkex/lykke.js';
import {AssetModel, InstrumentModel} from '../models';
import {BaseStore} from './index';

class MarketStore extends BaseStore {
  private result: any = {};
  private graph: any = {};

  init = (instruments: InstrumentModel[], assets: AssetModel[]) => {
    const {g, d, u} = this.initData(instruments);
    for (const asset of assets) {
      this.result[asset.id] = buildDijkstra(asset.id, g, {...d}, {...u});
    }
    this.graph = g;
  };

  reset = () => {
    this.result = {};
    this.graph = {};
  };

  convert = (
    amount: number,
    assetFrom: any,
    assetTo: any,
    getInstrumentById: (id: string) => InstrumentModel | undefined
  ) => {
    const precalc = this.result[assetFrom];
    if (!precalc) {
      return 0;
    }
    const path = [];
    for (let v = assetTo; v && v !== assetFrom; v = precalc[v]) {
      path.push(v);
    }
    path.push(assetFrom);

    const resultedPath = path.reverse();
    if (resultedPath.length === 1) {
      return amount;
    }

    let output = amount;
    for (let i = 0; i < resultedPath.length - 1; i++) {
      const firstAssetData = this.graph[resultedPath[i]];
      if (!firstAssetData) {
        return 0;
      }
      const secondAssetData = firstAssetData[resultedPath[i + 1]];
      if (!secondAssetData) {
        return 0;
      }
      const {pair, straight} = secondAssetData;
      const instrument = getInstrumentById(pair);
      if (!instrument) {
        return 0;
      }
      if (straight && instrument.bid) {
        output *= instrument.bid;
      } else if (!straight && instrument.ask) {
        output *= 1 / instrument.ask;
      } else {
        return 0;
      }
    }

    return output;
  };

  private initData = (instruments: InstrumentModel[]) => {
    const g: any = {};
    const d: any = {};
    const u: any = {};

    for (const instrument of instruments) {
      const baseAssetId = instrument.baseAsset.id;
      const quoteAssetId = instrument.quoteAsset.id;

      if (!g[baseAssetId]) {
        g[baseAssetId] = {};
      }
      if (instrument.bid) {
        g[baseAssetId][quoteAssetId] = {
          weight: this.getWeight(instrument),
          pair: instrument.id,
          straight: true
        };
      }

      if (!g[quoteAssetId]) {
        g[quoteAssetId] = {};
      }
      if (instrument.ask) {
        g[quoteAssetId][baseAssetId] = {
          weight: this.getWeight(instrument),
          pair: instrument.id,
          straight: false
        };
      }

      d[baseAssetId] = Infinity;
      d[quoteAssetId] = Infinity;
      u[baseAssetId] = false;
      u[quoteAssetId] = false;
    }
    return {g, d, u};
  };

  private getWeight(instrument: InstrumentModel) {
    const assets = [instrument.baseAsset.id, instrument.quoteAsset.id];

    if (assets.indexOf('BTC') !== -1) {
      return 1.1;
    } else if (assets.indexOf('ETH') !== -1) {
      return 1.11;
    } else if (assets.indexOf('USD') !== -1) {
      return 1.111;
    }
    return 1.1111;
  }
}

export default MarketStore;
