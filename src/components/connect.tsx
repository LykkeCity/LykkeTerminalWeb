import {inject, observer} from 'mobx-react';
import {BaseStore, RootStore} from '../stores/index';

export const connect = (
  storeSelector: (stores: RootStore) => {[P: number]: BaseStore} | any,
  component: React.SFC<any> | React.ComponentClass<any>
) => inject(storeSelector)(observer(component));
