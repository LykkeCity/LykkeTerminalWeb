import {rem, rgb} from 'polished';
import styled from 'styled-components';
import {colors, fonts} from '../styled';

export const MyWalletsContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

export const Sidebar = styled.div`
  background-color: ${rgb(45, 45, 45)};
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${rem(8)};
`;

export const WalletNameList = styled.div`
  flex-wrap: nowrap;
  overflow: hidden;
`;

export const ManageAccountLink = styled.a`
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  cursor: pointer;
  color: ${colors.white};
  font-size: ${fonts.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${rem(250)};
  min-height: ${rem(32)};
  margin-top: 1rem;
  padding: ${rem(8)} 0;
  text-align: center;
  text-decoration: none;
`;

export const StyledWalletItem = styled.div`
  background-color: ${(p: any) => (p.selected ? rgb(60, 60, 60) : '')};
  border-radius: 2px;
  color: ${colors.white};
  cursor: pointer;
  display: flex;
  padding: ${rem(10)};
` as any;

export const WalletName = styled.div`
  color: ${colors.white};
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: ${rem(100)};
`;

export const WalletTotalBalance = styled.div`
  margin-left: auto;
  text-align: right;
  color: #f5f6f7;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const Total = styled.div`
  color: ${colors.white};
  text-align: center;
  margin-top: auto;
`;

export const TotalAmount = styled.div`
  font-family: 'Akrobat', sans-serif;
  font-size: ${rem(fonts.extraLarge)};
  font-weight: bold;
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

export const WalletBalances = styled.div`
  width: 100%;
  height: 100%;
  margin-left: ${rem(8)};
`;
