import {mount} from 'enzyme';
import * as React from 'react';
import {AssetModel, InstrumentModel} from '../../../models';
import {ThemeProvider, themes} from '../../styled';
import InstrumentListItem from '../InstrumentListItem';

describe('<InstrumentListItem>', () => {
  let baseAsset: AssetModel;
  let instrument: InstrumentModel;
  let inactive: boolean;
  let isAuth: boolean;
  let onPick: (instrument: InstrumentModel) => void;

  const getTestInstrumentListItem = () => {
    return (
      <ThemeProvider theme={themes.dark}>
        <table>
          <tbody>
            <InstrumentListItem
              baseAsset={baseAsset}
              instrument={instrument}
              inactive={inactive}
              isAuth={isAuth}
              onPick={onPick}
              theme={themes.dark}
            />
          </tbody>
        </table>
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    baseAsset = new AssetModel({
      id: 'BTC',
      name: 'BTC',
      canBeBase: true
    });

    instrument = new InstrumentModel({
      id: 'BTCUSD',
      baseAsset,
      quoteAsset: new AssetModel({id: 'USD'}),
      ask: 100
    });

    inactive = true;
    isAuth = true;
    onPick = jest.fn();
  });

  describe('method render', () => {
    it('should render table row', () => {
      const wrapper = mount(getTestInstrumentListItem());
      expect(wrapper.find('tr')).toHaveLength(1);
    });

    it('should contain 5 table divisions', () => {
      const wrapper = mount(getTestInstrumentListItem());
      expect(wrapper.find('td')).toHaveLength(5);
    });
  });

  describe('table divisions', () => {
    it('first table division should contain instrument display name', () => {
      const wrapper = mount(getTestInstrumentListItem());
      const td = wrapper.find('td').at(0);
      expect((td.props() as any).title).toBe(instrument.displayName);
      expect(td.html()).toContain(instrument.displayName);
    });

    describe('second table division', () => {
      it('should contain child with color prop with white color', () => {
        instrument.price = 123;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(1)
          .childAt(0);
        expect((child.props() as any).color).toBe(themes.dark.colors.text);
      });

      it('should contain child with color prop with grey color', () => {
        instrument.price = 0;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(1)
          .childAt(0);
        expect((child.props() as any).color).toBe(
          themes.dark.colors.instrumentVolumeText
        );
      });

      it('should contain child with num prop with formatted number', () => {
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(1)
          .childAt(0);
        expect((child.props() as any).num).toBe('--');
      });
    });

    describe('third table division', () => {
      it('should contain child with sign prop with + value', () => {
        instrument.change24h = 123;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(2)
          .childAt(0);
        expect((child.props() as any).sign).toBe('+');
      });

      it('should contain child with dynamics prop with up value', () => {
        instrument.change24h = 123;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(2)
          .childAt(0);
        expect((child.props() as any).dynamics).toBe('up');
      });

      it('should contain child with sign prop with empty value', () => {
        instrument.change24h = -123;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(2)
          .childAt(0);
        expect((child.props() as any).sign).toBe('');
      });

      it('should contain child with dynamics prop with down value', () => {
        instrument.change24h = -123;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(2)
          .childAt(0);
        expect((child.props() as any).dynamics).toBe('down');
      });

      it('should contain child with dynamics prop with zero value', () => {
        instrument.change24h = 0;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(2)
          .childAt(0);
        expect((child.props() as any).dynamics).toBe('zero');
      });

      it('should contain child with num prop with formatted number', () => {
        instrument.change24h = 123;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(2)
          .childAt(0);
        expect((child.props() as any).num).toBe('123.00');
      });

      it('should contain % if change24h is not a null', () => {
        instrument.change24h = -123;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(2)
          .childAt(0);
        expect(child.html()).toContain('%');
      });
    });

    describe('fourth table division', () => {
      it('should contain child with color prop with white color', () => {
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(3)
          .childAt(0);
        expect((child.props() as any).color).toBe(
          themes.dark.colors.instrumentVolumeText
        );
      });

      it('should contain child with num prop with formatted number', () => {
        instrument.volume = 123;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(3)
          .childAt(0);
        expect((child.props() as any).num).toBe('123');
      });

      it('should contain base asset name', () => {
        instrument.volume = 123;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(3)
          .childAt(0);
        expect(child.html()).toContain(instrument.baseAsset.name);
      });

      it('should not contain base asset name', () => {
        instrument.volume = 0;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(3)
          .childAt(0);
        expect(child.html()).not.toContain(baseAsset.name);
      });

      it('child of table division should not be rendered', () => {
        isAuth = false;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(3)
          .text();
        expect(child).toBe('');
      });
    });

    describe('fifth table division', () => {
      isAuth = true;

      it('should contain child with color prop with white color', () => {
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(4)
          .childAt(0);
        expect((child.props() as any).color).toBe(
          themes.dark.colors.instrumentVolumeText
        );
      });

      it('should contain child with num prop with formatted number', () => {
        instrument.volumeInBase = 2538;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(4)
          .childAt(0);
        expect((child.props() as any).num).toBe('2,538');
      });

      it('should contain base asset name', () => {
        instrument.volumeInBase = 123;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(4)
          .childAt(0);
        expect(child.html()).toContain(baseAsset.name);
      });

      it('should not contain base asset name', () => {
        instrument.volumeInBase = 0;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(4)
          .childAt(0);
        expect(child.html()).not.toContain(baseAsset.name);
      });

      it('should not contain instrument base asset name', () => {
        isAuth = false;
        instrument.volume = 0;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(4)
          .childAt(0);
        expect(child.html()).not.toContain(instrument.baseAsset.name);
      });

      it('should contain instrument base asset name', () => {
        isAuth = false;
        instrument.volume = 10;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(4)
          .childAt(0);
        expect(child.html()).toContain(instrument.baseAsset.name);
      });

      it('color should be white', () => {
        isAuth = false;
        instrument.volume = 10;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(4)
          .childAt(0);
        expect((child.props() as any).color).toBe(themes.dark.colors.text);
      });

      it('color should be white', () => {
        isAuth = false;
        instrument.volume = 0;
        const wrapper = mount(getTestInstrumentListItem());
        const child = wrapper
          .find('td')
          .at(4)
          .childAt(0);
        expect((child.props() as any).color).toBe(
          themes.dark.colors.instrumentVolumeText
        );
      });
    });
  });
});
