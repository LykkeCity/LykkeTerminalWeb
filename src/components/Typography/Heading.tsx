import {rem} from 'polished';
import styled from '../styled';

const Heading = styled.h1`
  color: white;
  display: inline-block;
  margin: 0;
  padding: ${rem(5)};
  font-weight: 600;
  font-size: ${rem(24)};
  line-height: ${rem(24)};
`;

export default Heading;
