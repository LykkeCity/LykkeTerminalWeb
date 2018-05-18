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

export const IconContainer = styled.i`
  cursor: pointer;
  opacity: ${(props: {opacity: any}) => props.opacity || 0.8};

  &:hover {
    opacity: 1;
  }
`;

export const Img = styled.img`
  width: 16px;
  height: 16px;
  vertical-align: middle;
`;
