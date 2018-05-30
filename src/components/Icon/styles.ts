import {lighten} from 'polished';
import styled from '../styled';

export const StyledIcon = styled.i`
  cursor: pointer;
  color: ${(props: any) => props.color};
  vertical-align: middle;
  &:hover {
    color: ${(props: any) => lighten(0.1, props.color || '#f5f6f7')};
  }
`;
