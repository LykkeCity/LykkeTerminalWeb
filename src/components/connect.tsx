import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStore} from '../stores/index';

export const connect = <P extends {} = any>(
  storeSelector: (stores: RootStore) => Partial<P>,
  component: React.ComponentType<any>
) => inject(storeSelector)(observer(component));
