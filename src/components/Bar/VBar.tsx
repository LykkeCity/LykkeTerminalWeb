import {rem} from 'polished';
import styled, {colors} from '../styled';

const HBar = styled.div`
  background: ${colors.darkGraphite};
  position: relative;
  min-height: 24px;
  height: 100%;
  width: 1px;
  margin: 0 ${rem(12)};
`;

export default HBar;
