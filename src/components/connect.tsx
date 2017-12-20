import {inject, observer} from 'mobx-react';
import {RootStore} from '../stores/index';

export const connect = (
  storeSelector: (stores: RootStore) => {[P: number]: any} | any,
  component: React.SFC<any> | React.ComponentClass<any>
) => inject(storeSelector)(observer(component));
