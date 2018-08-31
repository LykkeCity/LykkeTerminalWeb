import {mount} from 'enzyme';
import React from 'react';
import {AssetModel, InstrumentModel, TradeModel} from '../../../models';
import TradeLog from '../TradeLog';

jest.mock('../../../utils/canvasUtils', () => {
  return {
    defineCanvasScale: jest.fn(),
    drawRect: jest.fn(),
    drawText: jest.fn(),
    fitString: jest.fn()
  };
});

import {getDefaultTransitionAnimationState} from '../../../utils/canvasAnimationUtils';
import {drawText} from '../../../utils/canvasUtils';

describe('<TradeLog>', () => {
  const width = 400;
  const itemHeight = 50;
  const instrument = new InstrumentModel({
    accuracy: 2,
    baseAsset: new AssetModel({
      accuracy: 2
    })
  });
  const trades = [
    new TradeModel({id: '1'}),
    new TradeModel({id: '2'}),
    new TradeModel({id: '3'})
  ];

  const getTestTradeLog = () => (
    <TradeLog
      width={width}
      itemHeight={itemHeight}
      selectedInstrument={instrument}
      trades={trades}
    />
  );

  it('should init default state with trades from parameters', () => {
    const wrapper = mount(getTestTradeLog());
    expect(wrapper.state()).toEqual({data: trades});
  });

  it('should render trades after component mount', () => {
    mount(getTestTradeLog());
    expect(drawText).toHaveBeenCalled();
  });

  describe('method componentWillReceiveProps', () => {
    it('should init animation states with for new trades only', () => {
      const wrapper = mount(getTestTradeLog());
      (wrapper.instance() as any).initAnimationStates = jest.fn();
      const newTrade = new TradeModel({id: '4'});
      const newTrades = trades.slice().concat(newTrade);

      wrapper.setProps({trades: newTrades});

      expect(
        (wrapper.instance() as any).initAnimationStates
      ).toHaveBeenCalledWith([newTrade]);
    });

    it('should update animation states', () => {
      const wrapper = mount(getTestTradeLog());
      const newTrades = trades.slice().concat(new TradeModel({id: '4'}));
      wrapper.setProps({trades: newTrades});
      expect((wrapper.instance() as any).animationStates).toHaveLength(1);
    });

    it('should set drawing interval and timeout', () => {
      const wrapper = mount(getTestTradeLog());
      const newTrades = trades.slice().concat(new TradeModel({id: '4'}));
      wrapper.setProps({trades: newTrades});
      expect((wrapper.instance() as any).drawingAnimationFrameId).toBeDefined();
      expect((wrapper.instance() as any).drawingTimeoutId).toBeDefined();
    });

    it('should call renderTrades method if no new trades came', () => {
      const wrapper = mount(getTestTradeLog());
      (wrapper.instance() as any).renderTrades = jest.fn();

      wrapper.setProps({trades});

      expect((wrapper.instance() as any).renderTrades).toBeDefined();
    });

    it('should not call runDrawingMechanism method if drawing animation interval is working', () => {
      const wrapper = mount(getTestTradeLog());
      (wrapper.instance() as any).runDrawingMechanism = jest.fn();
      (wrapper.instance() as any).drawingAnimationFrameId = true;

      wrapper.setProps({trades});

      expect(
        (wrapper.instance() as any).runDrawingMechanism
      ).not.toHaveBeenCalled();
    });

    it('should clear drawing interval on timeout', () => {
      const wrapper = mount(getTestTradeLog());
      const newTrades = trades.slice().concat(new TradeModel({id: '4'}));
      window.cancelAnimationFrame = jest.fn();
      window.setTimeout = (callback: any) => callback();
      wrapper.setProps({trades: newTrades});
      expect(window.cancelAnimationFrame).toHaveBeenCalled();
      expect((wrapper.instance() as any).drawingAnimationFrameId).toBeNull();
    });
  });

  describe('method componentWillUnmount', () => {
    it('should clear timeout and animation frame', () => {
      const wrapper = mount(getTestTradeLog());
      window.cancelAnimationFrame = jest.fn();
      window.clearTimeout = jest.fn();
      (wrapper.instance() as any).drawingAnimationFrameId = '1';
      (wrapper.instance() as any).drawingTimeoutId = '2';

      wrapper.unmount();

      expect(window.cancelAnimationFrame).toHaveBeenCalled();
      expect(window.clearTimeout).toHaveBeenCalled();
    });
  });

  describe('method renderTrades', () => {
    it('should not render canvas if no trades presented', () => {
      const wrapper = mount(getTestTradeLog());
      (wrapper.instance() as any).renderCanvas = jest.fn();

      (wrapper.instance() as any).renderTrades([]);

      expect((wrapper.instance() as any).renderCanvas).not.toHaveBeenCalled();
    });

    it('should set interval', () => {
      const wrapper = mount(getTestTradeLog());

      (wrapper.instance() as any).renderTrades(trades);

      expect(drawText).toHaveBeenCalled();
      expect(
        (wrapper.instance() as any).cancelAnimationIntervalId
      ).toBeDefined();
    });

    it('should clear interval if no animation presented', () => {
      const wrapper = mount(getTestTradeLog());
      window.setInterval = (callback: any) => callback();
      window.clearInterval = jest.fn();

      (wrapper.instance() as any).renderTrades(trades);

      expect(window.clearInterval).toHaveBeenCalledTimes(2);
    });

    it('should not clear interval while animation presented', () => {
      const wrapper = mount(getTestTradeLog());
      (wrapper.instance() as any).animationStates = [
        getDefaultTransitionAnimationState('1')
      ];
      window.setInterval = (callback: any) => callback();
      window.clearInterval = jest.fn();

      (wrapper.instance() as any).renderTrades(trades);

      expect(window.clearInterval).toHaveBeenCalledTimes(1);
    });
  });

  describe('method renderCanvas', () => {
    it('should clear canvas and draw new items', () => {
      const wrapper = mount(getTestTradeLog());
      const clearRect = jest.fn();
      (wrapper.instance() as any).canvasCtx.clearRect = clearRect;
      (wrapper.instance() as any).renderCanvas(trades);
      expect(clearRect).toHaveBeenCalled();
      expect(drawText).toHaveBeenCalled();
    });
  });

  describe('method clearCanvas', () => {
    it('should clear canvas', () => {
      const wrapper = mount(getTestTradeLog());
      const clearRect = jest.fn();
      (wrapper.instance() as any).canvasCtx.clearRect = clearRect;
      (wrapper.instance() as any).clearCanvas();
      expect(clearRect).toHaveBeenCalled();
    });
  });

  describe('method drawAnimation', () => {
    it('should remove finished animation', () => {
      const id = '1';
      const wrapper = mount(getTestTradeLog());
      (wrapper.instance() as any).animationStates = [
        getDefaultTransitionAnimationState(id)
      ];
      (wrapper.instance() as any).animationStates[0].isFinished = true;
      (wrapper.instance() as any).drawAnimation(trades[0], 'white', id);
      expect((wrapper.instance() as any).animationStates).toHaveLength(0);
    });
  });

  describe('method render', () => {
    it('should render canvas', () => {
      const wrapper = mount(getTestTradeLog());
      expect(wrapper.find('canvas')).toHaveLength(1);
    });
  });
});
