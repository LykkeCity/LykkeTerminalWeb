import {observer} from 'mobx-react';
import {rem} from 'polished';
import {curry, pathOr} from 'rambda';
import * as React from 'react';
import styled from 'styled-components';
import {InstrumentModel} from '../../models/index';
import Table from '../Table/Table';
import {TradeListItem, TradesProps} from './index';

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
  const assetFromSelectedInstrument = curry(assetFromInstrument)(
    selectedInstrument!
  );
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Asset pair</th>
            <th>Side</th>
            <th>Volume ({assetFromSelectedInstrument('baseAsset')})</th>
            <th>Price</th>
            <th>Volume ({assetFromSelectedInstrument('quoteAsset')})</th>
            <th>Order type</th>
            <th>Fee</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {trades.map(trade => (
            <TradeListItem key={`${trade.id}_${stringId}`} {...trade} />
          ))}
        </tbody>
      </Table>
      {needToLoadMore && (
        <StyledBtnSection>
          <StyledBtn onClick={fetchPart}>Load more...</StyledBtn>
        </StyledBtnSection>
      )}
    </div>
  );
};

export default observer(Trades);
