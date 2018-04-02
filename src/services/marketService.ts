import {AssetModel, InstrumentModel} from '../models';

class MarketService {
  private result: any = {};
  private graph: any = {};

  init = (insturments: InstrumentModel[], assets: AssetModel[]) => {
    const {g, d, u} = this.initData(insturments);
    for (const asset of assets) {
      this.result[asset.id] = this.buildDeikstra(asset.id, g, {...d}, {...u});
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
      if (!instrument || !instrument.price) {
        return 0;
      }
      if (straight) {
        output *= instrument.price;
      } else {
        output *= 1 / instrument.price;
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
      g[baseAssetId][quoteAssetId] = {
        weight: 1,
        pair: instrument.id,
        straight: true
      };

      if (!g[quoteAssetId]) {
        g[quoteAssetId] = {};
      }
      g[quoteAssetId][baseAssetId] = {
        weight: 1,
        pair: instrument.id,
        straight: false
      };

      d[baseAssetId] = Infinity;
      d[quoteAssetId] = Infinity;
      u[baseAssetId] = false;
      u[quoteAssetId] = false;
    }

    return {g, d, u};
  };

  private buildDeikstra = (start: string, g: any, d: any, u: any) => {
    d[start] = 0;
    const keys = Object.keys(g);
    const result = {};
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < keys.length; i++) {
      let v = '';

      for (const j of keys) {
        if (!u[j] && (!v || d[j] < d[v])) {
          v = j;
        }
      }
      if (d[v] === Infinity) {
        break;
      }
      u[v] = true;
      // tslint:disable-next-line:forin
      for (const j in g[v]) {
        const to = j;
        const weight = g[v][j].weight;
        if (d[v] + weight < d[to]) {
          d[to] = d[v] + weight;
          result[to] = v;
        }
      }
    }
    return result;
  };
}

export default new MarketService();
