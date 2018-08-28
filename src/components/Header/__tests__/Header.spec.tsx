import {shallow} from 'enzyme';
import React from 'react';
import {AuthApi} from '../../../api';
import {AuthStore, RootStore, SettingsStore} from '../../../stores';
import Header from '../Header';

describe('<Header>', () => {
  let authStore: AuthStore;
  let settingsStore: SettingsStore;
  let readOnlyMode = false;

  const getTestHeader = () => {
    return (
      <Header
        authStore={authStore}
        settingsStore={settingsStore}
        readOnlyMode={readOnlyMode}
      />
    );
  };

  describe('Header for uninitialized user', () => {
    beforeEach(() => {
      const rootStore = new RootStore(true);
      authStore = new AuthStore(rootStore, new AuthApi(rootStore));
      settingsStore = new SettingsStore(rootStore);
    });

    it('should render instrument picker', () => {
      const wrapper = shallow(getTestHeader());
      expect(wrapper.find('inject-InstrumentPicker')).toHaveLength(1);
    });

    it('should not render balance info', () => {
      const wrapper = shallow(getTestHeader());
      expect(wrapper.find('inject-BalanceInfo')).toHaveLength(0);
    });

    it('should not show cog wheel icon', () => {
      const wrapper = shallow(getTestHeader());
      expect(wrapper.find('Icon[name="cogwheel"]')).toHaveLength(0);
    });
  });

  describe('Header for logged in user', () => {
    beforeEach(() => {
      window.localStorage.getItem = jest.fn(() => '123');
      window.analytics = {
        track: jest.fn()
      };

      const rootStore = new RootStore(true);
      authStore = new AuthStore(rootStore, new AuthApi(rootStore));
      settingsStore = new SettingsStore(rootStore);
    });

    it('should render balance info', () => {
      const wrapper = shallow(getTestHeader());
      expect(wrapper.find('inject-BalanceInfo')).toHaveLength(1);
    });

    it('should show cog wheel icon', () => {
      const wrapper = shallow(getTestHeader());
      const icon = wrapper.find('Icon[name="cogwheel"]');
      expect(icon).toHaveLength(1);
    });

    describe('Readonly mode', () => {
      beforeEach(() => {
        readOnlyMode = true;
      });

      it('should not render balance info', () => {
        const wrapper = shallow(getTestHeader());
        expect(wrapper.find('inject-BalanceInfo')).toHaveLength(0);
      });

      it('should not show cog wheel icon', () => {
        const wrapper = shallow(getTestHeader());
        expect(wrapper.find('Icon[name="cogwheel"]')).toHaveLength(0);
      });
    });
  });
});
