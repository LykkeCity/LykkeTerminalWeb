import * as React from 'react';
import {walletNames} from '../../constants/walletNames';
import {AssetModel} from '../../models';
import {WalletBalanceList} from '../WalletBalanceList/';
import NameList from './NameList';
import {Container, LeftContainer, Link, RightContainer} from './styled';
import TotalBalance from './TotalBalance';

interface MyWalletsProps {
  total: number;
  totalTrading: number;
  baseAsset: AssetModel;
  balances: any[];
  currentWallet: number;
  setNewCurrentWallet: any;
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
    this.wallets = [...walletNames];
    this.changeWallet = this.changeWallet.bind(this);
  }

  changeWallet(index: any) {
    return (e: any) => {
      this.setState(
        {
          indexOfWallet: index
        },
        () => {
          this.props.setNewCurrentWallet(index);
        }
      );
    };
  }

  render() {
    return (
      <Container>
        <LeftContainer>
          <NameList
            selectedIndex={this.state.indexOfWallet}
            wallets={this.wallets}
            onChangeWallet={this.changeWallet}
            total={
              this.props.balances[this.state.indexOfWallet]
                ? this.props.balances[this.state.indexOfWallet].totalBalance
                : 0
            }
            baseAssetName={this.props.baseAsset.name}
            accuracy={this.props.baseAsset.accuracy}
            tradingWalletBalance={this.props.totalTrading}
            totalList={
              this.props.balances
                ? this.props.balances.map(a => a.totalBalance)
                : []
            }
          />
          <TotalBalance
            total={this.props.total}
            accuracy={this.props.baseAsset.accuracy}
            name={this.props.baseAsset.name}
          />
          <Link href={process.env.REACT_APP_WEBWALLET_URL} target="_blank">
            Manage Wallets
          </Link>
        </LeftContainer>

        <RightContainer>
          <WalletBalanceList
            wallet={this.props.balances[this.state.indexOfWallet]}
          />
        </RightContainer>
      </Container>
    );
  }
}
export default MyWallets;
