import {connect} from '../connect';
import {withScroll} from '../CustomScrollbar/index';
import TradeList from './TradeList';

const ConnectedTradeList = withScroll(
  connect(
    ({tradeStore: {allTrades}}) => ({
      trades: allTrades
    }),
    TradeList
  )
);

export {ConnectedTradeList as TradeList};
export {default as TradeListItem} from './TradeListItem';
