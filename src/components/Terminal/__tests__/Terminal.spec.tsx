import {shallow} from 'enzyme';
import React from 'react';
import {RootStore, UiStore} from '../../../stores';
import Terminal from '../Terminal';

describe('<Terminal>', () => {
  let history: any;
  const rootStore = new RootStore(true);
  let match: any;
  const location: any = {};

  const getTestTerminal = () => {
    return (
      <Terminal
        rootStore={rootStore}
        history={history}
        match={match}
        location={location}
      />
    );
  };

  describe('method componentDidMount', () => {
    beforeEach(() => {
      history = {push: jest.fn()};
      match = {params: {}};
    });

    it('should set default instrument in route', () => {
      shallow(getTestTerminal());
      expect(history.push).toHaveBeenCalledWith(
        `/trade/${UiStore.DEFAULT_INSTRUMENT}`
      );
    });

    it('should set user selected instrument in route', () => {
      const instrument = 'BTCEUR';
      match = {params: {instrument}};
      shallow(getTestTerminal());
      expect(history.push).toHaveBeenCalledWith(`/trade/${instrument}`);
    });
  });
});
