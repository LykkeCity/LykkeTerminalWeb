import * as React from 'react';

import {rem} from 'polished';
import styled from 'styled-components';
import {colors, dims, fonts, padding} from '../styled';

interface ExportProps {
  exportHistory: any;
}

const StyledSpan = styled.span`
  font-size: ${rem(fonts.normal)};
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: #ccc;
  color: #8c94a0;
  padding: ${padding(...dims.padding)};
  cursor: not-allowed;

  &.clickable {
    color: ${colors.white};
    cursor: pointer;
  }
`;

const Export: React.SFC<ExportProps> = ({exportHistory}) => {
  return (
    <StyledSpan className={'clickable'} onClick={exportHistory}>
      Export history (csv)
    </StyledSpan>
  );
};

export default Export;
