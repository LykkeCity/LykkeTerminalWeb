import {rem, rgb} from 'polished';
import styled from '../../styled';
export const StyledCurrentWallet = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${rem(-1)};
  margin-right: ${rem(24)};
  small {
    color: rgb(140, 148, 160);
    font-size: ${rem(12)};
    line-height: 1.33;
    text-align: left;
    width: 76px;
    height: 15px;
  }
`;
export const CurrentWalletName = styled.div`
  color: ${rgb(245, 246, 247)};
  font-family: 'Akrobat', sans-serif;
  font-size: ${rem(16)};
  font-weight: bold;
  text-align: left;
  text-transform: uppercase;
  width: 102px;
  height: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
