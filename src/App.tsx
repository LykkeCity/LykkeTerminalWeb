import {fontFace, normalize} from 'polished';
import * as React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {SignInPage} from './components/SignInPage';
import {injectGlobal} from './components/styled';
import {Terminal} from './components/Terminal';
import paths from './constants/paths';
import './index.css';

const addFont = (name: string) => (f: any) =>
  fontFace({
    fileFormats: ['woff', 'eot', 'ttf'],
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
const addIconFont: any = addFont('icomoon');

const allFonts = [
  {weight: 200, name: 'ProximaNovaThin'},
  {weight: 300, name: 'ProximaNova-Light'},
  {weight: 400, name: 'ProximaNovaRegular'},
  {weight: 600, name: 'ProximaNova-Semibold'},
  {weight: 700, name: 'ProximaNovaBold'}
];
const iconFonts = [{weight: 'normal', name: 'icomoon'}];

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  ${allFonts.map(addBaseFont)};
  ${iconFonts.map(addIconFont)}
  ${normalize() as any};
  * {
    border-collapse: collapse;
  }
  :root {
    height: auto;
    min-height: 100%;
    font: 600 14px "Proxima Nova";
    color: #f5f6f7;
    font-size-adjust: none;
    line-height: normal;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  li {
    list-style: none;
  }
`;

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact={true} path={paths.singin} component={SignInPage} />
          <Route exact={true} path="/" component={Terminal} />
        </Switch>
      </Router>
    );
  }
}

export default App;
