import {Provider} from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {RootStore} from './stores/index';
import {addLocaleData, IntlProvider} from 'react-intl';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';

addLocaleData([...en, ...ru]);

let locale =
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  'en-US';

const rootStore = new RootStore();

const render = (AppComponent: any) => {
  ReactDOM.render(
    <Provider {...rootStore}>
      <IntlProvider>
        <AppComponent locale={locale} />
      </IntlProvider>
    </Provider>,
    document.getElementById('root') as HTMLElement
  );
};

render(App);
