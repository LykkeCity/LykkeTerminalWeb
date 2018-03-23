// ///////////////////////////////MyWallets/////////////////////////////////
export interface MyWalletsProps {
  name?: string;
}
export interface MyWalletsState {
  indexOfWallet: number;
}

export {default as MyWallets} from './MyWallets';

// ///////////////////////////////MyWalletNames/////////////////////////////////
export interface WalletNamesProps {
  wallets: string[];
  onChangeWallet: any;
  selectedIndex: number;
}

// ///////////////////////////////WalletName/////////////////////////////////
export interface WalletNameProps {
  name: string;
  selectedIndex: boolean;
}
