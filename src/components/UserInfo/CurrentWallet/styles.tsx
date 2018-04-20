import {rem} from 'polished';
import styled, {colors, fonts} from '../../styled';

export const StyledCurrentWallet = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${rem(16)};
  text-align: right;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    height: 24px;
    margin-top: -12px;
    border-right: solid 1px rgba(0, 0, 0, 0.2);
  }

  span {
    color: ${colors.white};
    font-family: 'Akrobat', sans-serif;
    font-size: ${fonts.large};
    font-weight: bold;
    text-transform: uppercase;
    width: ${rem(150)};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    position: relative;
    top: -1px;
  }

  small {
    color: #8c94a0;
    font-size: ${rem(12)};
  }
`;
