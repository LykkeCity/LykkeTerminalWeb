import * as React from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {TradeModel} from '../../models/index';
import {Table} from '../Table/index';
import {PublicTradeListItem} from './index';
import './styles.css';

interface PublicTradeListProps {
  trades: TradeModel[];
  isProcessingWampTrades: boolean;
}

export const PublicTradeList: React.SFC<PublicTradeListProps> = ({
  trades = [],
  isProcessingWampTrades
}) => (
  <Table>
    <TransitionGroup component={'tbody'}>
      {trades.map(trade => (
        <CSSTransition
          key={trade.id}
          timeout={300}
          classNames={isProcessingWampTrades ? trade.side.toLowerCase() : ''}
        >
          <PublicTradeListItem key={trade.id} {...trade} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  </Table>
);

export default PublicTradeList;
