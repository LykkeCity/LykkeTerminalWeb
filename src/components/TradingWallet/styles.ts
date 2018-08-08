import {rem} from 'polished';
import styled from 'styled-components';
import {Table} from '../Table';

export const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const StyledWalletItem = styled.div`
  background-color: none;
  border-radius: 2px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  height: 100%;
`;

export const WalletBalances = styled.div`
  width: 100%;
  height: 100%;
`;

export const WalletBalanceListHeader = Table.extend`
  width: 100%;
  margin-bottom: 0;
  cursor: default;

  th {
    color: ${props => props.theme.colors.tableHeaderText};
    text-align: left;

    &:first-child {
      padding-left: ${rem(4)};
    }
    &:last-child {
      padding-right: ${rem(4)};
    }
  }
`;

WalletContainer.displayName = 'WalletContainer';
