import {connect} from '../connect';
import OrderBookChart from './OrderBookChart';

// tslint:disable:object-literal-sort-keys
const ConnectedOrderBookChart = connect(
  ({orderBookChartStore: {span, nextSpan, prevSpan}}) => {
    return {
      span,
      onNextSpan: nextSpan,
      onPrevSpan: prevSpan
    };
  },
  OrderBookChart
);

export default ConnectedOrderBookChart;
export {default as OrderBookChart} from './OrderBookChart';
