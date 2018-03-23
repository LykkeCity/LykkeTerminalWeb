import * as React from 'react';
import {MyWalletsProps, MyWalletsState} from './index';

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

  WalletsName() {
    return this.wallets.map((name, index) => {
      return (
        <div key={index} onClick={this.changeWallet(index)}>
          name
        </div>
      );
    });
  }

  render() {
    const child = this.props.children
      ? this.props.children[this.state.indexOfWallet]
      : null;
    return (
      <div>
        <div>
          {this.wallets.map((name, index) => {
            return (
              <div key={index} onClick={this.changeWallet(index)}>
                {name}
              </div>
            );
          })}
        </div>
        <div>{child}</div>
      </div>
    );
  }
}
export default MyWallets;
