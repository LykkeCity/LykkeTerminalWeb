import {observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {BalanceList} from '../BalanceList';
import {Pill, Pills} from '../Tile/styles';
import {WalletBalanceList} from '../WalletBalanceList';

export interface AccountProps {
  foo?: string;
}

enum AccountDisplayType {
  Trading,
  All
}

export class Account extends React.Component<AccountProps> {
  @observable selectedIdx = AccountDisplayType.Trading;

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

export default observer(Account);
