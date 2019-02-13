import RootStore from '../../stores/rootStore';
import {connect} from '../connect';
import Terminal from './Terminal';

export interface TerminalProps {
  rootStore: RootStore;
  history: any;
  instrument?: string;
}

const connectedTerminal = connect(
  rootStore => ({
    rootStore
  }),
  Terminal
);

export {connectedTerminal as Terminal};
