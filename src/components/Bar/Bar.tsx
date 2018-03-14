import {rem} from 'polished';
import styled from '../styled';

const Bar = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  height: 1px;
  margin-right: ${rem(15)};
`;

export const VBar = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  width: 1px;
  min-height: ${rem(32)};
  height: 100%;
  margin: 0 ${rem(15)};
`;

export default Bar;
