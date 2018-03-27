import styled from 'styled-components';
import rem from 'polished/lib/helpers/rem';

// ...................MyWallets...................
export const Container = styled.div`
  display: flex;
  width: 100%;
`;

export const LeftContainer = styled.div`
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
  margin-top: ${rem(24)};
`;

// ...................TotalBalance...................
export const TotalContainer = styled.div`
  display: block;
  padding-left: 62px;
  padding-right: 67px;
  padding-top: 4px;
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
  opacity: 0.5;
  border-radius: 2px;
  background-color: #3c3c3c;
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
  color: var(--pale-grey);
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
