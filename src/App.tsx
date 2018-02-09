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
    fileFormats: ['woff', 'eot', 'ttf', 'otf'],
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
const addIconFont: any = addFont('icomoon');

const allFonts = [
  {weight: 200, name: 'ProximaNovaThin'},
  {weight: 300, name: 'ProximaNova-Light'},
  {weight: 400, name: 'ProximaNovaRegular'},
  {weight: 600, name: 'ProximaNova-Semibold'},
  {weight: 700, name: 'ProximaNovaBold'}
];
const akrobatFonts = [
  {weight: 100, name: 'Akrobat-Thin'},
  {weight: 200, name: 'Akrobat-ExtraLight'},
  {weight: 300, name: 'Akrobat-Light'},
  {weight: 400, name: 'Akrobat-Regular'},
  {weight: 600, name: 'Akrobat-SemiBold'},
  {weight: 700, name: 'Akrobat-Bold'},
  {weight: 800, name: 'Akrobat-ExtraBold'},
  {weight: 1000, name: 'Akrobat-Black'}
];
const iconFonts = [{weight: 'normal', name: 'icomoon'}];

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  ${allFonts.map(addBaseFont)};
  ${akrobatFonts.map(addAkrobatFont)};
  ${iconFonts.map(addIconFont)}
  ${normalize() as any};
  * {
    border-collapse: collapse;
  }
  :root {
    height: auto;
    min-height: 100%;
    font: normal 14px "Proxima Nova";
    color: #f5f6f7;
    line-height: normal;

    /* Adjust font size */
    -webkit-text-size-adjust: 100%;
    /* Font varient */
    font-variant-ligatures: none;
    -webkit-font-variant-ligatures: none;
    /* Smoothing */
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;

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
