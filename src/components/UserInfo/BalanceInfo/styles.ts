import {rem} from 'polished';
import styled from 'styled-components';

export const BalanceInfoDiv = styled.div`
  text-align: right;
  padding: 0 ${rem(16)};
`;

export const BalanceValue = styled.span`
  color: #f5f6f7;
  font-family: Lekton, monospace;
  font-size: ${rem(16)};
  font-weight: bold;
  line-height: 1;
  text-align: left;
`;

export const BaseAssetLabel = styled.span`
  font-family: 'Akrobat', sans-serif;
  font-weight: bold;
  font-size: ${rem(16)};
  line-height: 1;
  color: #0388ef;
  padding: 1px 0 1px 8px;
`;

export const BalanceLabel = styled.div`
  color: #8c94a0;
  font-size: ${rem(12)};
`;
