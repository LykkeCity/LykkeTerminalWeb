import {rem} from 'polished';
import styled from '../styled';

export const StyledConnectionStatus = styled.div`
  font-size: ${rem(12)};

  &:before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 7px;
    border-radius: 50%;
    background: ${props => props.theme.colors.disconnectedStatusBackground};
  }

  &.connected {
    &:before {
      background: ${props => props.theme.colors.connectedStatusBackground};
    }
  }
`;
