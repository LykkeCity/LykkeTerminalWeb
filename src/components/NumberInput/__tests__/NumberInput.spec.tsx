import {mount} from 'enzyme';
import React from 'react';
import {ArrowDirection} from '../../../models';
import {ThemeProvider, themes} from '../../styled';
import NumberInput from '../NumberInput';

describe('<NumberInput>', () => {
  let id: string;
  let value: string;
  let onChange: any;
  let onArrowClick: (direction: ArrowDirection) => () => void;

  const getTestNumberInput = () => (
    <ThemeProvider theme={themes.dark}>
      <NumberInput
        id={id}
        value={value}
        onChange={onChange}
        onArrowClick={onArrowClick}
      />
    </ThemeProvider>
  );

  beforeEach(() => {
    id = '1';
    value = '100';
    onChange = jest.fn(() => jest.fn());
    onArrowClick = jest.fn(() => jest.fn());
  });

  describe('method render', () => {
    it('should render styled input', () => {
      const wrapper = mount(getTestNumberInput());
      expect(wrapper.find('input')).toHaveLength(1);
    });

    it('should call onChange callback', () => {
      const wrapper = mount(getTestNumberInput());
      wrapper.find('input').simulate('keydown', {which: '1'});
      expect(onChange).toHaveBeenCalled();
    });

    it('should call onArrowClick callback for Up button', () => {
      const wrapper = mount(getTestNumberInput());
      wrapper.find('input').simulate('keydown', {keyCode: 38});
      expect(onArrowClick).toHaveBeenCalledWith(ArrowDirection.Up);
    });

    it('should call onArrowClick callback ofr Down button', () => {
      const wrapper = mount(getTestNumberInput());
      wrapper.find('input').simulate('keydown', {keyCode: 40});
      expect(onArrowClick).toHaveBeenCalledWith(ArrowDirection.Down);
    });

    it('should not call onArrowClick callback for Right button', () => {
      const wrapper = mount(getTestNumberInput());
      wrapper.find('input').simulate('keydown', {keyCode: 39});
      expect(onArrowClick).not.toHaveBeenCalled();
    });
  });
});
