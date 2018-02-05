import * as React from 'react';
import {TradesProps} from './index';
import Trades from './Trades';

export const PublicTradeList: React.SFC<TradesProps> = ({
  trades = [],
  fetchPart
}) => (
  <div>
    <Trades
      trades={trades}
      fetchPart={fetchPart}
      stringId={'public'} // TODO delete after implementing real API for public trades
    />
  </div>
);

export default PublicTradeList;
