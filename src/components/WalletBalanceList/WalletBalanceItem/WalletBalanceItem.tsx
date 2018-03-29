import {observer} from 'mobx-react';
import * as React from 'react';
import {AssetModel} from '../../../models';
import WalletBalanceNumber from './WalletBalanceNumber';

interface WalletBalanceItemProps {
  balance: any;
  baseAsset: AssetModel;
  asset: AssetModel;
}

interface WalletBalanceItemState {
  convertedBalance: number;
}

class WalletBalanceItem extends React.Component<
  WalletBalanceItemProps,
  WalletBalanceItemState
> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <tr>
        <td>{this.props.balance.AssetId}</td>
        <td />
        <td>
          <WalletBalanceNumber
            num={this.props.balance.balanceInBaseAsset}
            accuracy={this.props.baseAsset.accuracy}
            color={'rgba(245, 246, 247, 0.4)'}
          >
            &nbsp;{this.props.baseAsset.name}
          </WalletBalanceNumber>
        </td>
        <td>
          <WalletBalanceNumber
            num={this.props.balance.Balance}
            accuracy={this.props.asset.accuracy}
          >
            &nbsp;{this.props.asset.name}
          </WalletBalanceNumber>
        </td>
      </tr>
    );
  }
}

export default observer(WalletBalanceItem);
