import React from 'react';
import {BarTh, StyledHeader} from './styles';

export default () => (
  <StyledHeader>
    <tbody>
      <tr>
        <BarTh />
        <th>Price</th>
        <th>Volume</th>
        <th>Value</th>
      </tr>
    </tbody>
  </StyledHeader>
);
