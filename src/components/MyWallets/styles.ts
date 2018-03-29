import {rem, rgb} from 'polished';
import styled from 'styled-components';

// ...................MyWallets...................
export const MyWalletsContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

export const WalletOverview = styled.div`
  background-color: ${rgb(45, 45, 45)};
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  padding: ${rem(8)};
`;

export const WalletNames = styled.div``;

export const WalletBalances = styled.div`
  width: 100%;
  height: 100%;
`;

export const ManageWalletsLink = styled.a`
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  cursor: pointer;
  color: ${rgb(245, 246, 247)};
  font-size: ${rem(14)};
  text-align: center;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${rem(250)};
  min-height: ${rem(32)};
  margin-top: auto;
  padding: ${rem(8)} 0;
`;

export const Br = styled.div`
  width: 272px;
  height: 1px;
  opacity: 0.4;
  background-color: rgba(0, 0, 0, 0.2);
`;

// ...................TotalBalance...................
export const Total = styled.div`
  color: ${rgb(255, 255, 255)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: ${rem(10)};
`;

export const TotalAmount = styled.div`
  font-family: 'Akrobat', sans-serif;
  font-size: ${rem(24)};
  font-weight: bold;
`;

export const TotalLabel = styled.div`
  opacity: 0.4;
  font-size: ${rem(12)};
`;

// ...................Name...................
export const WalletItem = styled.div`
  border-radius: 2px;
  color: ${rgb(245, 246, 247)};
  cursor: pointer;
  padding: ${rem(10)};
`;

export const WalletItemSelected = WalletItem.extend`
  background-color: ${rgb(60, 60, 60)};
`;

export const WalletItemContainer = styled.div`
  display: flex;
`;

export const WalletName = styled.div`
  font-weight: 600;
`;

export const WalletTotalBalance = styled.div`
  margin-left: auto;
`;
