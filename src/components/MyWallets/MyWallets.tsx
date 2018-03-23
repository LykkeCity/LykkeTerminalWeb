import * as React from 'react';
import styled from 'styled-components';
import {MyWalletsProps, MyWalletsState} from './index';
import WalletNames from './WalletNames';

const StyledMyWalletsLeft = styled.div`
  width: 288px;
  height: 264px;
  border-radius: 2px;
  background-color: #2d2d2d;
  padding: 10px;
`;

const StyledWalletNames = styled.div`
  width: 288px;
  height: 264px;
  border-radius: 2px;
  background-color: #2d2d2d;
`;

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
      <div>
        <StyledMyWalletsLeft>
          <StyledWalletNames>
            <WalletNames
              selectedIndex={this.state.indexOfWallet}
              wallets={this.wallets}
              onChangeWallet={this.changeWallet}
            />
          </StyledWalletNames>
        </StyledMyWalletsLeft>
        <div>{child}</div>
      </div>
    );
  }
}
export default MyWallets;
