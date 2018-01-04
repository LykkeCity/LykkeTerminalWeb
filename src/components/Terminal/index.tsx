import {connect} from '../connect';
import Terminal from './Terminal';

const connectedTerminal = connect(
  rootStore => ({
    rootStore
  }),
  Terminal
);

export {connectedTerminal as Terminal};
