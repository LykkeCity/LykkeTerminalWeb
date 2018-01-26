import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';

interface TileAdditionalControlProps {
  actionName: string;
  action: any;
  index: number;
}

const StyledSpan = styled.span`
  margin-right: 5px;
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: #ccc;
  padding: ${rem(8)} ${rem(18)};
  &:hover {
    cursor: pointer;
  }
`;

const TileAdditionalControlItem: React.SFC<TileAdditionalControlProps> = ({
  actionName,
  action,
  index
}) => (
  <StyledSpan key={index} onClick={action}>
    {actionName}
  </StyledSpan>
);

export default TileAdditionalControlItem;
