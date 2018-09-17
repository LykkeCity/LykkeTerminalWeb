import {action, computed, observable} from 'mobx';
import {reverse, take} from 'rambda';
import {AnalyticsEvents} from '../constants/analyticsEvents';
import chart from '../constants/chartConstants';
import {DepthArea, Order} from '../models';
import {AnalyticsService} from '../services/analyticsService';
import {formattedNumber} from '../utils/localFormatted/localFormatted';
import {precisionFloor} from '../utils/math';
import {BaseStore, RootStore} from './index';
import {aggregateOrders, connectLimitOrders} from './orderBookHelpers';

const emptyLabels = ['', '', '', ''];
export const DEFAULT_DEPTH_CHART_WIDTH = 1024;
export const DEFAULT_DEPTH_CHART_HEIGHT = 512;
export const MULTIPLERS = [0, 1, 0.75, 0.5, 0.25, 0.1, 0.05, 0.025];
export const DEFAULT_SPAN_MULTIPLIER_IDX = 3;

const sumPrice = (sum: number, curr: Order) => sum + curr.volume * curr.price;

class DepthChartStore extends BaseStore {
  multiplers: number[] = [...MULTIPLERS];
  maxMultiplier = this.multiplers.length - 1;
  @observable spanMultiplierIdx = DEFAULT_SPAN_MULTIPLIER_IDX;
  @observable width: number = DEFAULT_DEPTH_CHART_WIDTH;
  @observable height: number = DEFAULT_DEPTH_CHART_HEIGHT;
  @observable asks: Order[] = [];
  @observable bids: Order[] = [];

  @computed
  get span() {
    return this.multiplers[this.spanMultiplierIdx] * 100;
  }

  @computed
  get seedSpan() {
    if (this.rootStore.uiStore.selectedInstrument) {
      return Math.pow(10, -this.rootStore.uiStore.selectedInstrument.accuracy);
    }
    return 0;
  }

  @computed
  get instrumentSpan() {
    if (this.rootStore.uiStore.selectedInstrument) {
      return precisionFloor(
        this.seedSpan * 1,
        this.rootStore.uiStore.selectedInstrument.accuracy
      );
    }
    return 0;
  }

  @computed
  get isMaxZoom(): boolean {
    return (
      this.multiplers[this.spanMultiplierIdx] ===
      this.multiplers[this.multiplers.length - 1]
    );
  }

  @computed
  get isMinZoom(): boolean {
    return this.multiplers[this.spanMultiplierIdx] === this.multiplers[1];
  }

  @computed
  get getBids() {
    const {
      orderListStore: {limitOrdersForThePair: limitOrders}
    } = this.rootStore;
    const aggregatedOrders = aggregateOrders(
      this.bids,
      this.instrumentSpan,
      false
    );
    return this.reduceBidsArray(
      connectLimitOrders(aggregatedOrders, limitOrders, this.span, false)
    );
  }

  @computed
  get getAsks() {
    const {
      orderListStore: {limitOrdersForThePair: limitOrders}
    } = this.rootStore;
    const aggregatedOrders = aggregateOrders(
      this.asks,
      this.instrumentSpan,
      true
    );
    return this.reduceAsksArray(
      reverse(
        connectLimitOrders(aggregatedOrders, limitOrders, this.span, true)
      )
    );
  }

  @computed
  get asksLabels(): string[] {
    const asksLabels = [];
    if (this.getAsks.length) {
      const start = this.getMaxAskPrice();
      const end = this.getMinAskPrice();
      const step = (end - start) / chart.mesh.verticalLinesAmount;
      for (let i = 0; i < chart.mesh.verticalLinesAmount; i++) {
        if (i % 2 === 1) {
          const label = formattedNumber(
            start + step * i,
            this.rootStore.uiStore.selectedInstrument!.accuracy
          );
          asksLabels.push(label);
        }
      }
    }

    return asksLabels.length ? reverse(asksLabels) : emptyLabels;
  }

  @computed
  get bidsLabels(): string[] {
    const bidsLabels = [];
    if (this.getBids.length) {
      const start = this.getMaxBidPrice();
      const end = this.getMinBidPrice();
      const step = (start - end) / chart.mesh.verticalLinesAmount;
      for (let i = chart.mesh.verticalLinesAmount; i > 0; i--) {
        if (i % 2 === 1) {
          const label = formattedNumber(
            start - step * i,
            this.rootStore.uiStore.selectedInstrument!.accuracy
          );
          bidsLabels.push(label);
        }
      }
    }
    return bidsLabels.length ? bidsLabels : emptyLabels;
  }

  @computed
  get depthLabels(): string[] {
    const labels = [];
    if (this.getAsks.length || this.getBids.length) {
      const maximum = this.getMinMaxDepth(Math.max) / chart.scaleFactor;
      const step = maximum / chart.mesh.horizontalLinesAmount;
      for (let i = 0; i < chart.mesh.horizontalLinesAmount; i++) {
        const value = step * (i + 1) - step / 2;
        let formattedLabel;
        value < 1000
          ? (formattedLabel = formattedNumber(value, chart.labelsAccuracy))
          : (formattedLabel = `${formattedNumber(value / 1000, 1)}k`);
        labels.push(formattedLabel);
      }
    }
    return labels.reverse();
  }

  constructor(store: RootStore) {
    super(store);
  }

  @action
  setWidth = (width: number) => {
    this.width = width;
  };

  @action
  setHeight = (height: number) => {
    this.height = height;
  };

  @action
  nextSpan = () => {
    if (this.spanMultiplierIdx < this.maxMultiplier) {
      this.spanMultiplierIdx++;

      AnalyticsService.track(
        AnalyticsEvents.DepthChartZoom(this.spanMultiplierIdx)
      );
    }
  };

  @action
  prevSpan = () => {
    if (this.spanMultiplierIdx > 1) {
      this.spanMultiplierIdx--;

      AnalyticsService.track(
        AnalyticsEvents.DepthChartZoom(this.spanMultiplierIdx)
      );
    }
  };

  reduceBidsArray = (bids: Order[]) => {
    const maximum = Math.max(...bids.map(b => b.price));
    const lowerBound =
      maximum - maximum * this.multiplers[this.spanMultiplierIdx];
    const filteredBids = bids.filter(bid => bid.price > lowerBound);
    return filteredBids.length ? filteredBids : bids.slice(0, 1);
  };

  reduceAsksArray = (asks: Order[]) => {
    const minimum = Math.min(...asks.map(a => a.price));
    const upperBound =
      minimum + minimum * this.multiplers[this.spanMultiplierIdx];
    const filteredAsks = asks.filter(ask => ask.price < upperBound);
    return filteredAsks.length
      ? filteredAsks
      : asks.slice(asks.length - 1, asks.length);
  };

  updateAsks = (asks: Order[]) => (this.asks = asks);
  updateBids = (bids: Order[]) => (this.bids = bids);

  mid = async () => await this.rootStore.orderBookStore.mid();

  spread = async () => {
    const bestAsk = await this.rootStore.orderBookStore.getBestAsk();
    const bestBid = await this.rootStore.orderBookStore.getBestBid();
    return ((bestAsk - bestBid) / bestAsk) * 100;
  };

  calculateExactPrice = (area: DepthArea, index: number): number => {
    return area === DepthArea.Bid
      ? this.calculateExactBidPrice(index)
      : this.calculateExactAskPrice(index);
  };

  calculateExactBidPrice = (index: number) => {
    return take(this.getBids.length - index, this.getBids).reduce(sumPrice, 0);
  };

  calculateExactAskPrice = (index: number) => {
    return take(index, reverse(this.getAsks)).reduce(sumPrice, 0);
  };

  findOrder = (area: DepthArea, index: number) => {
    return area === DepthArea.Bid ? this.findBid(index) : this.findAsk(index);
  };

  findBid = (index: number) => reverse(this.getBids)[index];
  findAsk = (index: number) => reverse(this.getAsks)[index - 1];

  getCoefficient = () => {
    const minDepth = this.getMinMaxDepth(Math.min);
    const maxDepth = this.getMinMaxDepth(Math.max);

    if (!minDepth || !maxDepth) {
      return 1;
    }

    return minDepth === maxDepth
      ? this.getCoefficientByDepth(minDepth)
      : this.getCoefficientByDepth(maxDepth);
  };

  getCoefficientByDepth = (depth: number) => {
    return ((this.height - chart.labelsHeight) / depth) * chart.scaleFactor;
  };

  getMinMaxDepth = (operation: any) => {
    return operation(
      ...this.getBids.concat(reverse(this.getAsks)).map(x => x.depth)
    );
  };

  calculateOrderXInterval = (width: number, area: DepthArea) => (
    index: number
  ) => {
    const priceDifference =
      area === DepthArea.Bid
        ? this.getBidPriceDifference(index)
        : this.getAskPriceDifference(index);

    const priceRange =
      area === DepthArea.Bid
        ? this.getBidPriceRange()
        : this.getAskPriceRange();

    const length = (width * priceDifference) / priceRange;
    return isNaN(length) ? width : length;
  };

  calculateOrderYInterval = (coefficient: number) => (depth: number) => {
    return coefficient * depth;
  };

  getBidPriceDifference = (index: number) => {
    return this.getBids[index + 1]
      ? this.getMaxBidPrice() - this.getBids[index + 1].price
      : this.getMaxBidPrice() - this.getBids[index].price;
  };

  getAskPriceDifference = (index: number) => {
    const asks = reverse(this.getAsks);
    return asks[index + 1]
      ? asks[index + 1].price - this.getMinAskPrice()
      : asks[index].price - this.getMinAskPrice();
  };

  getBidPriceRange = () => {
    return this.getMaxBidPrice() - this.getMinBidPrice();
  };

  getAskPriceRange = () => {
    return this.getMaxAskPrice() - this.getMinAskPrice();
  };

  getMinAskPrice = () => {
    return Math.min(...this.getAsks.map(a => a.price));
  };

  getMaxAskPrice = () => {
    return Math.max(...this.getAsks.map(a => a.price));
  };

  getMinBidPrice = () => {
    return Math.min(...this.getBids.map(a => a.price));
  };

  getMaxBidPrice = () => {
    return Math.max(...this.getBids.map(a => a.price));
  };

  getMidXAsks = () => {
    return (
      (this.width - chart.labelsWidth) / 2 + Math.round(chart.strokeWidth / 2)
    );
  };

  getMidXBids = () => {
    return (
      (this.width - chart.labelsWidth) / 2 - Math.round(chart.strokeWidth / 2)
    );
  };

  getAskWidth = () => {
    return this.width - chart.labelsWidth - this.getMidXAsks();
  };

  reset = () => {
    this.spanMultiplierIdx = 1;
  };
}

export default DepthChartStore;
