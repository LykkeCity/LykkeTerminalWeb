import {pathOr} from 'rambda';
import {connect} from '../connect';
import DepthChart from './DepthChart';

const formatWithAccuracy = (num: number, accuracy: number) =>
  num.toLocaleString(undefined, {
    maximumFractionDigits: accuracy
  });

const ConnectedDepthChart = connect(
  ({
    depthChartStore: {mid, nextSpan, prevSpan},
    uiStore: {selectedInstrument}
  }) => ({
    mid: mid(),
    quoteAccuracy: pathOr(0, ['accuracy'], selectedInstrument),
    format: formatWithAccuracy,
    onNextSpan: nextSpan,
    onPrevSpan: prevSpan
  }),
  DepthChart
);

export default ConnectedDepthChart;
export {default as DepthChart} from './DepthChart';
