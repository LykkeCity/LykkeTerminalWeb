import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import {AssetModel} from '../../models';
import {WalletBalanceList} from '../WalletBalanceList/';
import NameList from './NameList';
import {
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
          <Scrollbars style={{height: 33 * 3, width: 288}}>
            <NameList
              selectedIndex={this.state.index}
              wallets={wallets.slice(0, 3)}
              onChangeWallet={this.handleChangeWallet}
              baseAssetName={baseAsset.name}
              accuracy={baseAsset.accuracy}
            />
          </Scrollbars>
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
        </WalletOverview>

        <WalletBalances>
          <WalletBalanceList wallet={this.props.wallets[this.state.index]} />
        </WalletBalances>
      </MyWalletsContainer>
    );
  }
}

export default MyWallets;
