import {pathOr} from 'rambda';
import * as React from 'react';
import {InstrumentModel, TradeModel} from '../../models';
import {LoaderProps} from '../Loader/withLoader';
import {HeaderProps, TableHeaderWithoutSort} from '../Table';
import {PublicTradeList} from './';

export interface TradeLogProps extends LoaderProps {
  selectedInstrument: InstrumentModel;
  trades: TradeModel[];
  getIsWampTradesProcessed: () => boolean;
  setIsWampTradesProcessed: (isProcessing: boolean) => void;
}


class TradeLog extends React.Component<TradeLogProps, TableSortState> {
  componentWillReceiveProps(args: TradeLogProps) {
    this.setState({
      data: args.trades
    });
  }

  componentDidUpdate() {
    const {getIsWampTradesProcessed, setIsWampTradesProcessed} = this.props;
    if (getIsWampTradesProcessed()) {
      setIsWampTradesProcessed(false);
    }
  }

  render() {
    const headers: HeaderProps[] = [
      {
        key: 'price',
        value: `Price (${pathOr('', ['quoteAsset', 'name'], this.props.selectedInstrument)})`
      },
      {
        className: 'right-align',
        key: 'volume',
        value: 'Trade size'
      },
      {
        className: 'right-align',
        key: 'timestamp',
        value: 'Time'
      }
    ];;

    return (
      <React.Fragment>
        <TableHeaderWithoutSort headers={headers} />
        <PublicTradeList
          trades={this.state.data}
          isProcessingWampTrades={this.props.getIsWampTradesProcessed()}
        />
      </React.Fragment>
    );
  }
}

export default TradeLog;
