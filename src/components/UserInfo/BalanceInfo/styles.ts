import {rem} from 'polished';
import styled from 'styled-components';

export const BalanceInfoDiv = styled.div`
  text-align: right;
  padding: 0 ${rem(16)};
`;

export const BalanceValue = styled.span`
  color: #f5f6f7;
  font-family: 'Akrobat', sans-serif;
  font-size: ${rem(16)};
  font-weight: bold;
  line-height: 1;
  text-align: left;
`;

export const Button = styled.button`
  background: none;
  border: none;
  font-family: 'Akrobat', sans-serif;
  font-size: ${rem(16)};
  font-weight: bold;
  line-height: 1;
  text-align: right;
  color: #0388ef;
  padding-right: 0;
  outline: none;
  &:hover {
    cursor: pointer;
  }
`;

export const BalanceLabel = styled.div`
  color: #8c94a0;
  font-size: ${rem(12)};
`;
