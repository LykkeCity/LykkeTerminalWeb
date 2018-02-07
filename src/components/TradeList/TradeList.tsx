import * as React from 'react';
import Unauthorized from '../Unauthorized/Unauthorized';
import {TradesProps} from './index';
import Trades from './Trades';

const TradeList: React.SFC<TradesProps> = ({
  trades = [],
  fetchPart,
  authorized
}) =>
  authorized ? (
    <Trades trades={trades} fetchPart={fetchPart} />
  ) : (
    <Unauthorized />
  );

export default TradeList;
