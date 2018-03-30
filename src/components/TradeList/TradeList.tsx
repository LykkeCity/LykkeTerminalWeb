import {curry, pathOr} from 'rambda';
import * as React from 'react';
import {TradeListItem} from '.';
import {InstrumentModel, TradeModel} from '../../models';
import {sortData, Table, TableHeader, TableSortState} from '../Table';

const assetFromInstrument = (instrument: InstrumentModel, assetType: string) =>
  pathOr('', [assetType, 'name'], instrument);

export interface TradeListProps {
  trades: TradeModel[];
  selectedInstrument: InstrumentModel | null;
}

class TradeList extends React.Component<TradeListProps, TableSortState> {
  constructor(props: TradeListProps) {
    super(props);
    this.state = {
      data: this.props.trades,
      sortByParam: '',
      sortDirection: 'ASC'
    };
  }

  componentWillReceiveProps(args: any) {
    this.setState({
      data: args.trades
    });
  }

  sort = (sortByParam: string, sortDirectionDefault: string) => {
    this.setState(
      sortData(this.props.trades, sortByParam, sortDirectionDefault, this.state)
    );
  };

  render() {
    const assetFromSelectedInstrument = curry(assetFromInstrument)(
      this.props.selectedInstrument!
    );
    const headers: any[] = [
      {key: 'symbol', value: 'Asset pair'},
      {className: 'right-align', key: 'side', value: 'Side'},
      {
        className: 'right-align',
        key: 'quantity',
        value: `Volume (${assetFromSelectedInstrument('baseAsset')})`
      },
      {className: 'right-align', key: 'price', value: 'Price'},
      {
        className: 'right-align',
        key: 'oppositeQuantity',
        value: `Volume (${assetFromSelectedInstrument('quoteAsset')})`
      },
      {className: 'right-align', key: 'orderType', value: 'Order type'},
      {className: 'right-align', key: 'fee', value: 'Fee'},
      {className: 'right-align', key: 'timestamp', value: 'Time'}
    ];

    return (
      <Table>
        <thead>
          <TableHeader
            backgroundColor={'rgb(51, 51, 51)'}
            currentSortDirection={this.state.sortDirection}
            currentSortByParam={this.state.sortByParam}
            headers={headers}
            onSort={this.sort}
          />
        </thead>
        <tbody>
          {this.state.data.map(trade => (
            <TradeListItem key={trade.id} {...trade} />
          ))}
        </tbody>
      </Table>
    );
  }
}

export default TradeList;
