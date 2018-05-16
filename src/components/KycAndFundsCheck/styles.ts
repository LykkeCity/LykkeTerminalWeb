import {MarginedModalBody} from '../Modal/styles';
import styled, {colors} from '../styled';

export const CheckBody = MarginedModalBody.extend`
  a {
    color: #0388ef;
  }
`;

export const CheckBackground = styled.div`
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  background-color: ${colors.lightGraphite};
`;
