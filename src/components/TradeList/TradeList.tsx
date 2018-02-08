import * as React from 'react';
import {TradesProps} from './index';
import Trades from './Trades';

const TradeList: React.SFC<TradesProps> = props => <Trades {...props} />;

export default TradeList;
