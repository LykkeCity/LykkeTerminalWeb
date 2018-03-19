import {observer} from 'mobx-react';
import {rem} from 'polished';
import {curry, pathOr} from 'rambda';
import * as React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import styled from 'styled-components';
import {InstrumentModel} from '../../models/index';
import {ReactStyledTable} from '../Table/index';
import {TradeListCell, TradesProps} from './index';

const assetFromInstrument = (instrument: InstrumentModel, assetType: string) =>
  pathOr('', [assetType, 'name'], instrument);

const StyledBtnSection = styled.div`
  display: flex;
  justify-content: center;
  margin: ${rem(5)} 0;
  width: 100%;
`;

const StyledBtn = styled.span`
  margin-right: 5px;
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: #f5f6f7;
  padding: ${rem(8)} ${rem(18)};

  &:hover {
    cursor: pointer;
  }
`;

const Trades: React.SFC<TradesProps> = ({
  trades = [],
  needToLoadMore,
  fetchPart,
  stringId = '',
  selectedInstrument
}) => {
  const data = [...trades];
  const assetFromSelectedInstrument = curry(assetFromInstrument)(
    selectedInstrument!
  );
  return (
    <div>
      <ReactStyledTable>
        <ReactTable
          data={data}
          columns={[
            {
              Header: 'Asset pair',
              accessor: 'symbol',
              className: 'left-align no-border',
              headerClassName: 'left-align header no-border',
              minWidth: 65
            },
            {
              Cell: props => (
                <TradeListCell side={props.original.side}>
                  {props.original.side}
                </TradeListCell>
              ),
              Header: 'Side',
              accessor: 'side',
              className: 'right-align no-border',
              headerClassName: 'right-align header no-border',
              minWidth: 40
            },
            {
              Cell: props => (
                <TradeListCell side={props.original.side}>
                  {props.original.quantity}
                </TradeListCell>
              ),
              Header: () =>
                `Volume (${assetFromSelectedInstrument('baseAsset')})`,
              accessor: 'quantity',
              className: 'right-align no-border',
              headerClassName: 'right-align header no-border',
              minWidth: 65
            },
            {
              Cell: props => (
                <TradeListCell side={props.original.side}>
                  {props.original.price}
                </TradeListCell>
              ),
              Header: 'Price',
              accessor: 'price',
              className: 'right-align no-border',
              headerClassName: 'right-align header no-border',
              minWidth: 60
            },
            {
              Cell: props => (
                <TradeListCell side={props.original.side}>
                  {props.original.oppositeQuantity}
                </TradeListCell>
              ),
              Header: () =>
                `Volume (${assetFromSelectedInstrument('quoteAsset')})`,
              accessor: 'oppositeQuantity',
              className: 'right-align no-border',
              headerClassName: 'right-align header no-border',
              minWidth: 60
            },
            {
              Cell: props => (
                <TradeListCell side={props.original.side}>
                  {props.original.orderType}
                </TradeListCell>
              ),
              Header: 'Order type',
              accessor: 'orderType',
              className: 'right-align no-border',
              headerClassName: 'right-align header no-border',
              minWidth: 50
            },
            {
              Cell: props => (
                <TradeListCell side={props.original.side}>
                  {props.original.fee}
                </TradeListCell>
              ),
              Header: 'Fee',
              accessor: 'fee',
              className: 'right-align no-border',
              headerClassName: 'right-align header no-border',
              minWidth: 35
            },
            {
              Cell: props => (
                <TradeListCell side={props.original.side}>
                  {new Date(props.original.timestamp).toLocaleString()}
                </TradeListCell>
              ),
              Header: 'Time',
              accessor: 'timestamp',
              className: 'right-align no-border',
              headerClassName: 'right-align header no-border',
              minWidth: 155
            }
          ]}
          className={'no-border table'}
          showPagination={false}
          pageSize={data.length}
        />
      </ReactStyledTable>
      {needToLoadMore && (
        <StyledBtnSection>
          <StyledBtn onClick={fetchPart}>Load more...</StyledBtn>
        </StyledBtnSection>
      )}
    </div>
  );
};

export default observer(Trades);
