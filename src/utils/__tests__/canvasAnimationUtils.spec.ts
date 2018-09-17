import {
  getDefaultTransitionAnimationState,
  ITransitionAnimationDetail,
  updateTransitionState
} from '../canvasAnimationUtils';
import {bigToFixed} from '../math';

describe('canvas animation utils', () => {
  describe('method getDefaultTransitionAnimationState', () => {
    it('should return object with default state', () => {
      const id = '1';
      const result = getDefaultTransitionAnimationState(id);
      expect(result.id).toBe(id);
      expect(result.isFinished).toBe(false);
      expect(result.isRising).toBe(true);
      expect(result.currentOpacity).toBe(0.1);
    });
  });

  describe('method updateTransitionState', () => {
    const id = '1';
    let state: ITransitionAnimationDetail;

    beforeEach(() => {
      state = getDefaultTransitionAnimationState(id);
    });

    it('should increase opacity if animation is rising and less then maximum', () => {
      updateTransitionState(state);
      expect(bigToFixed(state.currentOpacity, 1).toNumber()).toBe(0.2);
    });

    it('should decrease opacity if animation is not rising', () => {
      state.isRising = false;
      state.currentOpacity = 0.4;

      updateTransitionState(state);
      expect(bigToFixed(state.currentOpacity, 1).toNumber()).toBe(0.3);
    });

    it('should turn off rising if opacity is larger then maximum', () => {
      state.currentOpacity = 0.7;

      updateTransitionState(state);
      expect(state.isRising).toBe(false);
    });

    it('should finish animation if opacity is less then a zero', () => {
      state.isRising = false;
      state.currentOpacity = 0;

      updateTransitionState(state);
      expect(state.isFinished).toBe(true);
    });
  });
});
