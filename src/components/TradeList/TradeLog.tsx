import {pathOr} from 'rambda';
import * as React from 'react';
import {InstrumentModel, TradeModel} from '../../models';
import {LoaderProps} from '../Loader/withLoader';
import {sortData, Table, TableHeader, TableSortState} from '../Table';
import {HeaderCell} from '../Table/styles';
import {PublicTradeList} from './';

export interface TradeLogProps extends LoaderProps {
  selectedInstrument: InstrumentModel;
  trades: TradeModel[];
}

class TradeLog extends React.Component<TradeLogProps, TableSortState> {
  constructor(props: TradeLogProps) {
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
    return (
      <React.Fragment>
        <Table>
          <thead>
            <tr>
              <th>Trade size</th>
              <th>
                Price ({pathOr(
                  '',
                  ['quoteAsset', 'name'],
                  this.props.selectedInstrument
                )})
              </th>
              <HeaderCell w={50}>Side</HeaderCell>
              <th>Time</th>
            </tr>
          </thead>
        </Table>
        <PublicTradeList trades={this.state.data} />
      </React.Fragment>
    );
  }
}

export default TradeLog;
