import {rgb} from 'polished';
import styled from '../styled';

export const Spinner = styled.div`
  @keyframes donut-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  display: inline-block;
  border: 3px solid transparent;
  border-left-color: ${rgb(3, 136, 239)};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: donut-spin 1.2s linear infinite;
`;

export default Spinner;
