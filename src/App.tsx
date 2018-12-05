import '@lykkex/react-components'; // FIXME: why do we need this? no tree-shaking :( + you need to remove recharts from the components pkg
import {fontFace, normalize} from 'polished';
import * as React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Auth} from './components/Auth';
import {injectGlobal} from './components/styled';
import {Terminal} from './components/Terminal';
import paths from './constants/paths';
import './index.css';
import {AnalyticsService} from './services/analyticsService';

const addFont = (name: string) => (f: any) =>
  fontFace({
    fileFormats: f.formats || ['woff', 'eot', 'ttf'],
    fontFamily: name,
    fontFilePath: `${process.env.PUBLIC_URL}/fonts/${f.name}`,
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: f.weight,
    localFonts: [''],
    unicodeRange: ''
  });

const addBaseFont: any = addFont('Proxima Nova');
const addAkrobatFont: any = addFont('Akrobat');

const proximaFonts = [
  {weight: 400, name: 'ProximaNovaRegular'},
  {weight: 600, name: 'ProximaNova-Semibold'}
];
const akrobatFonts = [
  {weight: 400, name: 'Akrobat-Regular', formats: ['otf']},
  {weight: 600, name: 'Akrobat-SemiBold', formats: ['otf']}
];

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  ${proximaFonts.map(addBaseFont) as any};
  ${akrobatFonts.map(addAkrobatFont) as any};
  ${normalize() as any};
  *, *::before, *::after {
    border-collapse: collapse;
  }
  html {
    font-size: 14px;
  }
  body {
    color: #fff;
    font-family: 'Proxima Nova', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', Helvetica, Arial, sans-serif;

    /* Adjust font size */
    -webkit-text-size-adjust: 100%;
    /* Font variant */
    font-variant-ligatures: none;
    -webkit-font-variant-ligatures: none;
    /* Smoothing */
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  li {
    list-style: none;
  }
  input:focus {
    outline: none;
  }
  button {
    font-family: 'Proxima Nova',sans-serif;
  }
  label {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
`;

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact={true} path={paths.auth} component={Auth} />
          <Route exact={true} path={paths.main} component={Terminal} />
        </Switch>
      </Router>
    );
  }

  componentDidMount() {
    AnalyticsService.handlePageLoading();
  }
}

export default App;
