import {rgb} from 'polished';
import styled from '../styled';

export const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  border-radius: 8px;
  top: calc(50% - 44px);
  left: calc(50% - 44px);

  width: 88px;
  height: 88px;
  background: ${rgb(17, 17, 17)};
  opacity: 0.8;
  z-index: 99;
`;
