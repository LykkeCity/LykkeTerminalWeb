import {reverse} from 'rambda';
import chart from '../../../constants/chartConstants';
import {connect} from '../../connect';
import Chart from './Chart';
import ChartWrapper from './ChartWrapper';
import Mesh from './Mesh';

// tslint:disable:object-literal-sort-keys
const ConnectedChartWrapper: any = connect(
  ({depthChartStore: {setWidth, setHeight}, uiStore: {selectedInstrument}}) => {
    return {
      setWidth,
      setHeight,
      selectedInstrument
    };
  },
  ChartWrapper
);

const ConnectedMesh = connect(
  ({depthChartStore: {height, width, asksLabels, bidsLabels, depthLabels}}) => {
    return {
      height: height - chart.labelsHeight,
      width: width - chart.labelsWidth,
      canvasHeight: height,
      canvasWidth: width,
      verticalLabels: [...bidsLabels, ...asksLabels],
      depthLabels
    };
  },
  Mesh
);

const ConnectedChart = connect(
  ({
    depthChartStore: {
      getAsks,
      getBids,
      height,
      width,
      calculateExactPrice,
      getCoefficient,
      findOrder,
      calculateOrderXInterval,
      calculateOrderYInterval,
      getMidXAsks,
      getMidXBids,
      getAskWidth
    },
    uiStore: {selectedInstrument}
  }) => {
    return {
      asks: reverse(getAsks),
      bids: getBids,
      height: height - chart.labelsHeight,
      width: width - chart.labelsWidth,
      canvasHeight: height,
      canvasWidth: width,
      baseAssetName: selectedInstrument!.baseAsset.name,
      quoteAssetName: selectedInstrument!.quoteAsset.name,
      quoteAccuracy: selectedInstrument!.quoteAsset.accuracy,
      baseAccuracy: selectedInstrument!.baseAsset.accuracy,
      priceAccuracy: selectedInstrument!.accuracy,
      calculateExactPrice,
      findOrder,
      calculateOrderXInterval,
      calculateOrderYInterval: calculateOrderYInterval(getCoefficient()),
      midXAsks: getMidXAsks(),
      midXBids: getMidXBids(),
      askWidth: getAskWidth()
    };
  },
  Chart
);

export default ConnectedChartWrapper;
export {default as ChartWrapper} from './ChartWrapper';
export {ConnectedMesh as Mesh};
export {ConnectedChart as Chart};
