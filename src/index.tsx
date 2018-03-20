import {Provider} from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {addLocaleData, IntlProvider} from 'react-intl';
import * as en from 'react-intl/locale-data/en';
import * as ru from 'react-intl/locale-data/ru';
import App from './App';
import './index.css';
import {RootStore} from './stores/index';

addLocaleData([...en, ...ru]);

const locale =
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  'en-US';
const rootStore = new RootStore();

const render = (AppComponent: any) => {
  ReactDOM.render(
    <Provider {...rootStore}>
      <IntlProvider locale={locale}>
        <AppComponent />
      </IntlProvider>
    </Provider>,
    document.getElementById('root') as HTMLElement
  );
};

render(App);

export {locale};
