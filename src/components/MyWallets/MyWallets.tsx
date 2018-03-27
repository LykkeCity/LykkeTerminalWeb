import * as React from 'react';
import {AssetModel} from '../../models';
import NameList from './NameList';
import {Container, LeftContainer, Link, RightContainer} from './styled';
import TotalBalance from './TotalBalance';

interface MyWalletsProps {
  name?: string;
  total: number;
  totalTrading: number;
  baseAsset: AssetModel;
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
    this.wallets = ['Trading wallet', 'All wallets'];
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
          <NameList
            selectedIndex={this.state.indexOfWallet}
            wallets={this.wallets}
            onChangeWallet={this.changeWallet}
            total={this.props.total}
            baseAssetName={this.props.baseAsset.name}
            accuracy={this.props.baseAsset.accuracy}
            tradingWalletBalance={this.props.totalTrading}
          />
          <TotalBalance
            total={this.props.total}
            accuracy={this.props.baseAsset.accuracy}
            name={this.props.baseAsset.name}
          />
          <Link href={process.env.REACT_APP_WEBWALLET_URL} target="_blank">
            Manage Wallets in Account
          </Link>
        </LeftContainer>
        <RightContainer>{child}</RightContainer>
      </Container>
    );
  }
}
export default MyWallets;
