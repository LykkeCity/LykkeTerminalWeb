import {useStrict} from 'mobx';
import {Provider} from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {RestAuthApi} from './api';
import App from './App';
import './index.css';
import {RootStore} from './stores/index';

useStrict(true);

const render = (AppComponent: any) => {
  ReactDOM.render(
    <Provider {...rootStore}>
      <AppComponent />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );
};

const rootStore = new RootStore();
rootStore.start().then(() => render(App));

const restAuthApi = new RestAuthApi();
restAuthApi.fetchBearerToken('/Auth').then(res => {
  localStorage.setItem('token', res.Result.Token);
});
