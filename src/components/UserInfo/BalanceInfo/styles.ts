import {rem} from 'polished';
import styled from 'styled-components';

export const BalanceInfoDiv = styled.div`
  text-align: right;
  padding: 0 ${rem(16)};
`;

export const BalanceValue = styled.span`
  color: ${props => props.theme.colors.headerTotalBalanceValue};
  font-family: 'Akrobat', sans-serif;
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
  color: ${props => props.theme.colors.headerBaseAssetLabel};
  padding: 1px 0 1px 8px;
`;

export const BalanceLabel = styled.div`
  color: ${props => props.theme.colors.headerFigureLabel};
  font-size: ${rem(12)};
`;
