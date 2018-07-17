import {rem} from 'polished';
import styled from 'styled-components';
import {fonts} from '../styled';

export const StyledUserName = styled.div`
  max-width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0 ${rem(16)};
  font-size: ${rem(fonts.large)};
  font-family: 'Akrobat', sans-serif;
  font-weight: bold;
`;
