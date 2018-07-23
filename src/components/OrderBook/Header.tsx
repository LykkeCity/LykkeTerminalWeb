import React from 'react';
import {FakeTh, StyledHeader} from './styles';

export default () => (
  <StyledHeader>
    <tbody>
      <tr>
        <FakeTh />
        <th>Price</th>
        <th>Volume</th>
        <th>Value</th>
      </tr>
    </tbody>
  </StyledHeader>
);
