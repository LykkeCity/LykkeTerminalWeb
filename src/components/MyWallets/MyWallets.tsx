import * as React from 'react';
import styled from 'styled-components';
import {MyWalletsProps, MyWalletsState} from './index';
import WalletNames from './WalletNames';

const StyledMyWalletsContainer = styled.div`
  display: flex;
  width: 100%;
`;

const StyledMyWalletsLeftContainer = styled.div`
  width: 288px;
  height: 264px;
  border-radius: 2px;
  background-color: #2d2d2d;
  padding: 9px;
`;

const StyledWalletsRightContainer = styled.div`
  width: 100%;
  height: 264px;
`;

const StyledWalletNames = styled.div``;

class MyWallets extends React.Component<MyWalletsProps, MyWalletsState> {
  private wallets: string[];
  constructor(props: MyWalletsProps) {
    super(props);
    this.state = {
      indexOfWallet: 0
    };
    this.wallets = ['WalletBalanceList', 'BalanceList'];
    this.changeWallet = this.changeWallet.bind(this);
  }

  changeWallet(index: any) {
    return (e: any) => {
      this.setState({
        indexOfWallet: index
      });
    };
  }

  render() {
    const child = this.props.children
      ? this.props.children[this.state.indexOfWallet]
      : null;
    return (
      <StyledMyWalletsContainer>
        <StyledMyWalletsLeftContainer>
          <StyledWalletNames>
            <WalletNames
              selectedIndex={this.state.indexOfWallet}
              wallets={this.wallets}
              onChangeWallet={this.changeWallet}
            />
            {/*  <ManageWalletLink> Manage wallets at account</ManageWalletLink>*/}
          </StyledWalletNames>
        </StyledMyWalletsLeftContainer>
        <StyledWalletsRightContainer>{child}</StyledWalletsRightContainer>
      </StyledMyWalletsContainer>
    );
  }
}
export default MyWallets;
