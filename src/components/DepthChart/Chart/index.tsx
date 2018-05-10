import {connect} from '../../connect';
import Chart from './Chart';
import ChartWrapper from './ChartWrapper';
import Mesh from './Mesh';
import Pointer from './Pointer';

// tslint:disable:object-literal-sort-keys
const ConnectedChartWrapper: any = connect(
  ({uiStore: {selectedInstrument}}) => {
    return {
      selectedInstrument
    };
  },
  ChartWrapper
);

const ConnectedMesh = connect(
  ({depthChartStore: {asks, bids, mid}, uiStore: {selectedInstrument}}) => {
    return {
      asks,
      bids,
      mid: mid(),
      baseAsset: selectedInstrument!.baseAsset.name,
      quoteAsset: selectedInstrument!.quoteAsset.name,
      quoteAccuracy: selectedInstrument!.quoteAsset.accuracy,
      baseAccuracy: selectedInstrument!.baseAsset.accuracy,
      priceAccuracy: selectedInstrument!.accuracy
    };
  },
  Mesh
);

const ConnectedChart = connect(
  ({depthChartStore: {asks, bids, mid}, uiStore: {selectedInstrument}}) => {
    return {
      asks,
      bids,
      mid: mid(),
      baseAsset: selectedInstrument!.baseAsset.name,
      quoteAsset: selectedInstrument!.quoteAsset.name,
      quoteAccuracy: selectedInstrument!.quoteAsset.accuracy,
      baseAccuracy: selectedInstrument!.baseAsset.accuracy,
      priceAccuracy: selectedInstrument!.accuracy
    };
  },
  Chart
);

const ConnectedPointer = connect(({uiStore: {selectedInstrument}}) => {
  return {
    baseAsset: selectedInstrument!.baseAsset.name,
    quoteAsset: selectedInstrument!.quoteAsset.name,
    quoteAccuracy: selectedInstrument!.quoteAsset.accuracy,
    baseAccuracy: selectedInstrument!.baseAsset.accuracy,
    priceAccuracy: selectedInstrument!.accuracy
  };
}, Pointer);

export default ConnectedChartWrapper;
export {default as ChartWrapper} from './ChartWrapper';
export {ConnectedMesh as Mesh};
export {ConnectedChart as Chart};
export {ConnectedPointer as Pointer};
