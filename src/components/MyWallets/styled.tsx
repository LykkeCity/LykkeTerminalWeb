import rem from 'polished/lib/helpers/rem';
import styled from 'styled-components';

// ...................MyWallets...................
export const Container = styled.div`
  display: flex;
  width: 100%;
`;

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 288px;
  height: 264px;
  border-radius: 2px;
  background-color: #2d2d2d;
  padding: 9px;
`;

export const NamesContainer = styled.div``;

export const RightContainer = styled.div`
  width: 100%;
  height: 264px;
`;

export const Link = styled.a`
  cursor: pointer;
  text-decoration: none;
  color: rgb(255, 255, 255);
  min-width: 250px;
  min-height: 48px;
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${rem(16)};
  font-weight: bold;
  line-height: 1;
  text-align: center;
  margin-top: auto;
`;
export const Br = styled.div`
  width: 272px;
  height: 1px;
  opacity: 0.4;
  background-color: rgba(0, 0, 0, 0.2);
`;
// ...................TotalBalance...................
export const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 62px;
  margin-right: 67px;
  margin-top: 20px;
`;
export const TotalPrice = styled.div`
  width: 159px;
  height: 24px;
  font-family: Akrobat;
  font-size: 22px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`;
export const NameOfTotal = styled.div`
  width: 71px;
  height: 15px;
  opacity: 0.4;
  font-family: ProximaNova;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`;

// ...................Name...................
export const ButtonSelected = styled.div`
  width: 272px;
  height: 32px;
  border-radius: 2px;
  background-color: #3c3c3c;
  padding: 10px;
  cursor: pointer;
`;
export const Button = styled.div`
  width: 272px;
  height: 32px;
  border-radius: 2px;
  padding: 10px;
  cursor: pointer;
`;
export const InnerContainerButton = styled.div`
  display: flex;
`;
export const StyledName = styled.div`
  width: 89px;
  height: 17px;
  font-family: ProximaNova;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #f5f6f7;
`;
export const CostOfWallet = styled.div`
  width: 91px;
  height: 17px;
  font-family: ProximaNova;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #f5f6f7;
  color: var(--pale-grey);
`;
