import {observer} from 'mobx-react/custom';
import * as React from 'react';
import {AssetModel} from '../../models';
import {WalletBalanceList} from '../WalletBalanceList/';
import NameList from './NameList';
import {
  BottomInfo,
  ManageWalletsLink,
  MyWalletsContainer,
  WalletBalances,
  WalletOverview
} from './styles';
import TotalBalance from './TotalBalance';

export interface MyWalletsProps {
  wallets: any[];
  onSelectWallet: any;
  total: number;
  baseAsset: AssetModel;
}

interface MyWalletsState {
  index: number;
}

class MyWallets extends React.Component<MyWalletsProps, MyWalletsState> {
  state = {
    index: 0
  };

  handleChangeWallet = (index: any) => {
    this.setState({index}, () => {
      this.props.onSelectWallet(index);
    });
  };

  render() {
    const {wallets, baseAsset, total} = this.props;
    return (
      <MyWalletsContainer>
        <WalletOverview>
          <NameList
            selectedIndex={this.state.index}
            wallets={wallets}
            onChangeWallet={this.handleChangeWallet}
            baseAssetName={baseAsset.name}
            accuracy={baseAsset.accuracy}
          />
          <BottomInfo>
            <TotalBalance
              total={total}
              accuracy={baseAsset.accuracy}
              name={baseAsset.name}
            />
            <ManageWalletsLink
              href={process.env.REACT_APP_WEBWALLET_URL}
              target="_blank"
            >
              Manage Wallets
            </ManageWalletsLink>
          </BottomInfo>
        </WalletOverview>
        <WalletBalances>
          {!!this.props.wallets.length && (
            <WalletBalanceList wallet={this.props.wallets[this.state.index]} />
          )}
        </WalletBalances>
      </MyWalletsContainer>
    );
  }
}

export default observer(MyWallets);
