import {shallow} from 'enzyme';
import React from 'react';
import {UserInfoModel} from '../../../models';
import {RootStore} from '../../../stores';
import Terminal from '../Terminal';

const oldLayout =
  '{"direction":"row","first":"Order","second":{"direction":"row","first":{"direction":"column","first":"Chart","second":"OrderList","splitPercentage":65},"second":{"direction":"column","first":"OrderBook","second":"TradeList","splitPercentage":70},"splitPercentage":73.30729166666667},"splitPercentage":20}';

describe('<Terminal>', () => {
  window.analytics = {
    identify: jest.fn(),
    track: jest.fn()
  };

  let history: any;
  const user = {
    Email: 'atata@email.com',
    FirstName: 'Michael',
    LastName: 'Jackson',
    KycStatus: 'Done'
  };
  let match: any;
  const location: any = {};
  const rootStore = new RootStore(true);
  rootStore.authStore.userInfo = new UserInfoModel(user);

  const getTestTerminal = () => (
    <Terminal
      rootStore={rootStore}
      history={history}
      match={match}
      location={location}
    />
  );

  describe('method updateLayoutFromLocalStorage', () => {
    beforeEach(() => {
      history = {push: jest.fn()};
      match = {params: {}};
    });

    it('should get layout from localstorage', () => {
      const wrapper = shallow(getTestTerminal());
      (wrapper.instance() as any).updateLayoutFromLocalStorage();
      expect(window.localStorage.getItem).toHaveBeenCalled();
    });

    it('should update state by layout from storage if structure is the same', () => {
      const wrapper = shallow(getTestTerminal());
      const state = wrapper.instance().state as any;
      window.localStorage.getItem = jest.fn(() =>
        JSON.stringify(state.initialValue)
      );
      wrapper.instance().setState = jest.fn();
      (wrapper.instance() as any).updateLayoutFromLocalStorage();
      expect(wrapper.instance().setState).toHaveBeenCalled();
    });

    it('should not update state by layout from storage if structure is different', () => {
      const wrapper = shallow(getTestTerminal());
      window.localStorage.getItem = jest.fn(() => oldLayout);
      wrapper.instance().setState = jest.fn();
      (wrapper.instance() as any).updateLayoutFromLocalStorage();
      expect(wrapper.instance().setState).not.toHaveBeenCalled();
    });

    it('should reset layout in storage if structure is different', () => {
      const wrapper = shallow(getTestTerminal());
      window.localStorage.getItem = jest.fn(() => oldLayout);
      (wrapper.instance() as any).updateLayoutFromLocalStorage();
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });
  });
});
