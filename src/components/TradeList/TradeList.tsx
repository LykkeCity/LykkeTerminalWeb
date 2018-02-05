import * as React from 'react';
import {TradesProps} from './index';
import Trades from './Trades';

const TradeList: React.SFC<TradesProps> = ({trades = [], fetchPart}) => (
  <div>
    <Trades trades={trades} fetchPart={fetchPart} />
  </div>
);

export default TradeList;
