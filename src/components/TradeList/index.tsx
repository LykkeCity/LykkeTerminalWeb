import {TradeModel} from '../../models';
import {connect} from '../connect';
import {withScroll} from '../CustomScrollbar/index';
import TradeList from './TradeList';

export interface TradeListProps {
  trades?: TradeModel[];
}

export interface TradeListItemProps {
  index: number;
  side: string;
  symbol: string;
  quantity: number;
  timestamp: Date;
  tradeId: number;
  price: number;
}

const ConnectedTradeList = withScroll(
  connect(
    ({tradeStore: {allTradeLists: trades}}) => ({
      trades
    }),
    TradeList
  )
);

export {ConnectedTradeList as TradeList};
export {default as TradeListItem} from './TradeListItem/TradeListItem';
