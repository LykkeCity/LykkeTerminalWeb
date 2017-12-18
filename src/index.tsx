import {useStrict} from 'mobx';
import {Provider} from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {RootStore} from './stores/index';

useStrict(true);

const rootStore = new RootStore();
rootStore.watchlistStore.fetchAll();
rootStore.tradeListStore.fetchAll();

ReactDOM.render(
  <Provider {...rootStore}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
