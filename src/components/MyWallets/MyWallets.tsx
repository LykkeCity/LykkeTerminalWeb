import * as React from 'react';
import NameList from './NameList';
import {
  Container,
  LeftContainer,
  Link,
  NamesContainer,
  RightContainer
} from './styled';

interface MyWalletsProps {
  name?: string;
  total: number;
}

export interface MyWalletsState {
  indexOfWallet: number;
}

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
      <Container>
        <LeftContainer>
          <NamesContainer>
            <NameList
              selectedIndex={this.state.indexOfWallet}
              wallets={this.wallets}
              onChangeWallet={this.changeWallet}
            />
            <div>Total: {this.props.total}</div>
            <Link href={process.env.REACT_APP_WEBWALLET_URL} target="_blank">
              Manage Wallets in Account
            </Link>
          </NamesContainer>
        </LeftContainer>
        <RightContainer>{child}</RightContainer>
      </Container>
    );
  }
}
export default MyWallets;
