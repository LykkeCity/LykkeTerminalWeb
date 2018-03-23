import {observable} from 'mobx';
import * as React from 'react';
import {BalanceList} from '../BalanceList';
import {Pill, Pills} from '../Tile/styles';
import {WalletBalanceList} from '../WalletBalanceList';

enum AccountDisplayType {
  Trading,
  All
}

export class Account extends React.Component {
  @observable selectedIdx = AccountDisplayType.Trading;

  constructor(props: any) {
    super(props);
  }

  toggle = (accountDisplayType: AccountDisplayType) => () => {
    this.selectedIdx = accountDisplayType;
  };

  render() {
    return (
      <React.Fragment>
        <Pills>
          <Pill
            active={this.selectedIdx === AccountDisplayType.Trading}
            onClick={this.toggle(AccountDisplayType.Trading)}
          >
            Trading wallet
          </Pill>
          <Pill
            active={this.selectedIdx === AccountDisplayType.All}
            onClick={this.toggle(AccountDisplayType.All)}
          >
            All wallets
          </Pill>
        </Pills>
        {this.selectedIdx === AccountDisplayType.Trading && (
          <WalletBalanceList />
        )}
        {this.selectedIdx === AccountDisplayType.All && <BalanceList />}
      </React.Fragment>
    );
  }
}

export default Account;
