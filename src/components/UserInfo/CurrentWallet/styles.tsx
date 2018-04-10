import {rem, rgb} from 'polished';
import styled from '../../styled';
export const StyledCurrentWallet = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${rem(24)};
  text-align: right;

  span {
    color: ${rgb(245, 246, 247)};
    font-family: 'Akrobat', sans-serif;
    font-size: ${rem(16)};
    font-weight: bold;
    text-transform: uppercase;
    width: 102px;
    height: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  small {
    color: #8c94a0;
    font-size: ${rem(12)};
  }
`;
