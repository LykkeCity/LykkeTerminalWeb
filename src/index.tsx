import {Provider} from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {RestAuthApi} from './api';
import App from './App';
import './index.css';
import {RootStore} from './stores/index';

const rootStore = new RootStore();

const restAuthApi = new RestAuthApi();

restAuthApi
  .fetchBearerToken('/client/auth')
  .then(res => {
    localStorage.setItem('token', res.AccessToken);
    return Promise.resolve();
  })
  .then(() => {
    rootStore.assetStore.fetchBaseAsset().then(() => {
      rootStore.watchlistStore.fetchAll();
      rootStore.tradeListStore.fetchAll();
      rootStore.orderBookStore.fetchAll();
      rootStore.balanceListStore.fetchAll();
      rootStore.orderListStore.fetchAll();
      rootStore.assetStore.fetchAll();
    });
  });

ReactDOM.render(
  <Provider {...rootStore} rootStore={rootStore}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
