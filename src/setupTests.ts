import Enzyme, {mount, render, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'raf/polyfill';

(window as any).requestAnimationFrame = callback => setTimeout(callback, 0);

// React 16 Enzyme adapter
Enzyme.configure({adapter: new Adapter()});

// Make Enzyme functions available in all test files without importing
(window as any).shallow = shallow;
(window as any).render = render;
(window as any).mount = mount;

const tradingView = {
  widget: jest.fn()
};

const localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  // tslint:disable-next-line:object-literal-sort-keys
  removeItem: jest.fn()
};

(window as any).TradingView = tradingView;
(window as any).localStorage = localStorage;
(window as any).Worker = jest.fn();
