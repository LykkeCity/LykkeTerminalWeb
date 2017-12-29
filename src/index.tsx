import {Provider} from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import startChart from './chart';
import './index.css';
import {RootStore} from './stores/index';

const render = (AppComponent: any) => {
  ReactDOM.render(
    <Provider {...rootStore}>
      <AppComponent />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );
};

const rootStore = new RootStore();
rootStore.start().then(() => {
  render(App);
  startChart();
});
