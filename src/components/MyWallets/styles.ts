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
  margin-left: ${rem(8)};
`;

export const ManageWalletsLink = styled.a`
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  cursor: pointer;
  color: ${rgb(245, 246, 247)};
  font-size: ${rem(14)};
  font-family: 'ProximaNova', sans-serif;
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

// ...................Names...................
export const WalletItemContainer = styled.div`
  display: flex;
  border-radius: 2px;
  color: ${rgb(245, 246, 247)};
  cursor: pointer;
  padding: ${rem(10)};
  width: 272px;
  height: 32px;

  &.selected-wallet-name {
    background-color: ${rgb(60, 60, 60)};
  }
`;

export const WalletName = styled.div`
  width: 90px;
  height: 17px;
  font-family: 'ProximaNova', sans-serif;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #f5f6f7;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const WalletTotalBalance = styled.div`
  margin-left: auto;
  width: 91px;
  height: 17px;
  font-family: 'ProximaNova', sans-serif;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #f5f6f7;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

// ...................TotalBalance...................
export const Total = styled.div`
  color: ${rgb(255, 255, 255)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

export const TotalAmount = styled.div`
  font-family: 'Akrobat', sans-serif;
  font-size: ${rem(24)};
  font-weight: bold;
  width: 159px;
  height: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
`;

export const TotalLabel = styled.div`
  opacity: 0.4;
  font-size: ${rem(12)};
  margin-top: ${rem(2)};
`;
