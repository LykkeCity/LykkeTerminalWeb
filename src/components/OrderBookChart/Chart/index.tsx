import {pathOr} from 'rambda';
import {connect} from '../../connect';
import ChartWrapper from './ChartWrapper';

// tslint:disable:object-literal-sort-keys
const ConnectedChart = connect(
  ({orderBookChartStore: {asks, bids, mid}, uiStore: {selectedInstrument}}) => {
    const priceAccuracy = pathOr(0, ['accuracy'], selectedInstrument);
    const midPrice = mid().toFixed(priceAccuracy);

    const baseAsset = selectedInstrument!.baseAsset.name;
    const quoteAsset = selectedInstrument!.quoteAsset.name;
    return {
      asks,
      bids,
      mid: midPrice,
      baseAsset,
      quoteAsset
    };
  },
  ChartWrapper
);

export default ConnectedChart;
export {default as ChartWrapper} from './ChartWrapper';
