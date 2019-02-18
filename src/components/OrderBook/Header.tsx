import React from 'react';
import {InstrumentModel} from '../../models';
import {BarTh, StyledHeader} from './styles';

export interface HeaderProps {
  instrument: InstrumentModel;
}

export default ({instrument}: HeaderProps) => (
  <StyledHeader>
    <tbody>
      <tr>
        <BarTh />
        <th>Price ({instrument && instrument.quoteAsset.name})</th>
        <th>Volume ({instrument && instrument.baseAsset.name})</th>
        <th>Value ({instrument && instrument.quoteAsset.name})</th>
      </tr>
    </tbody>
  </StyledHeader>
);
